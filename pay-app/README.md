# PayApp — Backend + Frontend (summary)

Short: a small payments demo — Express + Mongoose backend (users, accounts, transfers) and a React + Vite frontend. This README focuses on how the backend is implemented, the problems I hit (notably MongoDB transactions + replica set), and how to run everything locally.

---

## Repo layout (important files)
- Backend entry: [pay-app/backend/index.js](pay-app/backend/index.js)  
- DB + models: [pay-app/backend/db.js](pay-app/backend/db.js) (`User`, `Account`)  
- Routes (mounted at `/api/v1`): [pay-app/backend/routes/index.js](pay-app/backend/routes/index.js)  
  - User routes: [pay-app/backend/routes/user.js](pay-app/backend/routes/user.js)  
  - Account routes (balance, transfer): [pay-app/backend/routes/account.js](pay-app/backend/routes/account.js)  
- Auth middleware: [`authMiddleware`](pay-app/backend/middleware.js) — [pay-app/backend/middleware.js](pay-app/backend/middleware.js)  
- Validation schemas: [pay-app/backend/types.js](pay-app/backend/types.js) (zod)  
- Docker helper for mongo replica: [pay-app/Dockerfile](pay-app/Dockerfile)

Frontend quick refs:
- API client (axios + interceptors): [pay-app/frontend/src/lib/api.js](pay-app/frontend/src/lib/api.js)  
- Router + protected routes: [pay-app/frontend/src/App.jsx](pay-app/frontend/src/App.jsx), [pay-app/frontend/src/routes/RequireAuth.jsx](pay-app/frontend/src/routes/RequireAuth.jsx)

---

## Backend design (concise)
- Express app mounts a single router under `/api/v1` in [index.js](pay-app/backend/index.js).
- Mongoose models defined in [db.js](pay-app/backend/db.js): `User` and `Account` (Account references `User._id`).
- Request validation done with zod in [types.js](pay-app/backend/types.js).
- JWT auth: middleware in [middleware.js](pay-app/backend/middleware.js) expects `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, and sets `req.userId`.
- Routes:
  - POST `/api/v1/user/signup` — create user, create Account with random initial balance, return JWT. ([user.js](pay-app/backend/routes/user.js))
  - POST `/api/v1/user/signin` — authenticate and return JWT. ([user.js](pay-app/backend/routes/user.js))
  - GET `/api/v1/user/bulk?filter=` — search users by first/last name (regex). ([user.js](pay-app/backend/routes/user.js))
  - GET `/api/v1/account/balance` — auth-protected, returns balance. ([account.js](pay-app/backend/routes/account.js))
  - POST `/api/v1/account/transfer` — auth-protected, transfers funds using Mongoose transactions. ([account.js](pay-app/backend/routes/account.js))

---

## Biggest gotcha & solution — Transactions require a replica set
Problem encountered:
- Transaction calls failed with:
  > MongoError: Transaction numbers are only allowed on a replica set member or mongos

Root cause:
- MongoDB transactions require a replica set (even for a single local node). Standalone mongod doesn't support the transaction coordination primitives.

How I fixed it (two options):

1) Local mongod (system service)
- Edit your mongod config (common path: `/etc/mongod.conf`) and enable a replica set:
  ```yaml
  replication:
    replSetName: rs0
  ```
- Restart mongod:
  - `sudo systemctl restart mongod` (or your distro's service manager)
- Initiate replica set:
  - `mongo --eval "rs.initiate()"`

2) Docker (quick reproducible)
- The repo includes a Dockerfile that writes an init script to run `rs.initiate()` and starts mongod with replSet:
  - Example rapid command:
    - `docker build -t payapp-mongo pay-app/` then run a container or use the Dockerfile approach in the repo.
  - Or run directly:
    - `docker run --name mongors -d -p 27017:27017 mongo:4.4 --replSet rs0`
    - `docker exec -it mongors mongo --eval "rs.initiate()"`

Update your connection string after enabling replica set:
- Example: `mongodb://localhost:27017/payapp?replicaSet=rs0`  
Set that as `MONGO_URL` for the backend.

Why this matters:
- Once the DB runs as a replica set, Mongoose sessions and transactions work:
  - start with `const session = await mongoose.startSession(); session.startTransaction(); ... commit or abort; session.endSession();`
  - See the actual implementation in [pay-app/backend/routes/account.js](pay-app/backend/routes/account.js).

---

## Transfer implementation notes
- The transfer endpoint does:
  1. Validate request with zod (`transferBody`).
  2. Start a mongoose session and transaction.
  3. Read sender account and check balance.
  4. Read receiver user + receiver account.
  5. Use atomic `$inc` updates inside the same session:
     - `Account.updateOne({ userId }, { $inc: { balance: -amount } }).session(session)`
     - `Account.updateOne({ userId: toUser._id }, { $inc: { balance: amount } }).session(session)`
  6. Commit or abort + end the session.
- Edge cases handled: missing accounts, insufficient funds, invalid inputs — all return appropriate HTTP status codes.

Important implementation lessons:
- Always `session.endSession()` after commit/abort to avoid leaking sessions.
- Use `$inc` inside transactions to avoid race conditions.
- Ensure mongoose connection URL and server support replica sets for transactions to work.

---

## Running locally

1) Start MongoDB with replica set (see section above). Example using Docker:
   - `docker run --name mongors -d -p 27017:27017 mongo:4.4 --replSet rs0`
   - `docker exec -it mongors mongo --eval "rs.initiate()"`

2) Backend
```bash
cd pay-app/backend
npm install
export MONGO_URL="mongodb://localhost:27017/payapp?replicaSet=rs0"
export JWT_SECRET="dev-secret"
node index.js
# server listens on PORT (default 3000)
```

3) Frontend
```bash
cd pay-app/frontend
npm install
npm run dev
# open the vite dev URL (default http://localhost:5173)
```

Environment variables:
- Backend: `MONGO_URL`, `JWT_SECRET`, optional `PORT`
- Frontend: edit `pay-app/frontend/.env` (`VITE_API_URL=http://localhost:3000/api/v1`)

---

## Troubleshooting tips
- 404 on balance endpoint: confirm frontend calls `/account/balance` and `VITE_API_URL` points to backend. Check [Dashboard.jsx](pay-app/frontend/src/pages/Dashboard.jsx).
- 401 responses: ensure `payapp_token` exists in localStorage (signin/signup save it), and axios attaches it via [api.js](pay-app/frontend/src/lib/api.js).
- Transactions failing with the replica set error: ensure mongod is running with `--replSet` and `rs.initiate()` has been executed.
- If transactions appear to succeed but data not consistent: verify all updates are `.session(session)` bound and `session.commitTransaction()` is called.

---

## Notes / Learnings
- zod for request validation keeps endpoints robust.
- MongoDB `$lookup` avoids N+1 when joining users with accounts (see commented aggregate in [user.js](pay-app/backend/routes/user.js)).
- Transactions + replicaSet are essential for correct cross-document money transfers.
- Keep auth middleware tiny and strict to avoid confusing downstream errors.

---

## Next steps / TODOs
- Add rate limiting + idempotency for critical endpoints (transfer).
- Add integration tests for concurrent transfers.
- Move secrets to a vault for production.

---

If you want, I can:
- Add a small script to bootstrap a local mongo replica set via Docker Compose.
- Add basic integration tests for the transfer endpoint (concurrent requests).
- Expand the README with example requests (curl/postman) for each endpoint.
