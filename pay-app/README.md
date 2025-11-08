# PayApp Payment Transfers Demo
A hands-on payments app I built to understand how real money transfers work under the hood. Features user authentication, account balances, and secure transactions using MongoDB's ACID guarantees.

## Why I Built This
I wanted to learn how payment systems actually work—not just move numbers around, but implement proper transactional integrity. This project taught me:

How to use MongoDB transactions (spoiler: you need a replica set!)
JWT authentication and protected API routes
Building a clean separation between frontend auth flows and backend validation


## What It Does

Sign up / Sign in — JWT-based authentication
View your balance — See how much money you have
Send money — Transfer funds to other users with full transaction safety
Find users — Search for people to send money to

Everything uses real database transactions, so money can't mysteriously appear or disappear during transfers.


## Tech Stack
Backend: Node.js, Express, MongoDB, Mongoose, Zod (for validation), JWT
Frontend: React 18, React Router, Vite, Tailwind CSS, Axios
The Big Gotcha: MongoDB Needs a Replica Set
If you try to run transfers and get an error about "Transaction numbers are only allowed on a replica set member"—don't worry, I hit this too. Here's what's happening:
MongoDB transactions require coordination between multiple nodes, even if you're only running one. A standalone MongoDB instance can't do this.
Quick fix with Docker:
bashdocker run --name mongors -d -p 27017:27017 mongo:4.4 --replSet rs0
docker exec -it mongors mongo --eval "rs.initiate()"
Then update your connection string to include ?replicaSet=rs0.
Getting Started

## 1. Start MongoDB
Use the Docker commands above, or configure your local MongoDB to run as a replica set.

## 2. Run the Backend
bashcd backend
npm install
export MONGO_URL="mongodb://localhost:27017/payapp?replicaSet=rs0"
export JWT_SECRET="your-secret-key"
node index.js
The API runs on http://localhost:3000 by default.

## 3. Run the Frontend
bashcd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.


## API Endpoints
All routes are prefixed with /api/v1:
MethodEndpointWhat it doesPOST/user/signupCreate account and get tokenPOST/user/signinLog in and get tokenGET/user/bulk?filter=Search for usersGET/account/balanceGet your current balance (auth required)POST/account/transferSend money (auth required)


## How Transfers Work
The transfer endpoint uses MongoDB sessions and transactions to ensure money moves atomically:

Validate the request (Zod schemas catch bad inputs)
Start a database session
Check if sender has enough money
Deduct from sender and add to recipient—both in the same transaction
Commit the transaction (or abort if anything fails)

This means transfers either fully succeed or fully fail. No partial updates.


### Common Issues
Getting 401 errors? Make sure you're logged in. The frontend stores your token in localStorage as payapp_token.
Balance not showing? Check that the frontend is calling /account/balance with your auth token.
Transaction errors? Confirm MongoDB is running with --replSet and you ran rs.initiate().


### What I Learned

Zod validation catches bad requests before they hit your database
MongoDB aggregation with $lookup avoids the N+1 query problem when fetching related data
Transactions are non-negotiable for financial operations—you need proper ACID guarantees
Keep middleware simple. Complex auth logic leads to confusing bugs downstream.


License
MIT