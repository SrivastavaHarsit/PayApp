import 'dotenv/config';

const PORT = Number(process.env.PORT ?? 3000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'default-secret';
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'payapp_auth';
const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const env = { PORT, JWT_SECRET, CORS_ORIGINS, AUTH_COOKIE_NAME,
  NODE_ENV, };