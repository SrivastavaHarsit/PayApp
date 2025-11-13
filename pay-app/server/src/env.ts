import 'dotenv/config';

const PORT = Number(process.env.PORT ?? 3000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'default-secret';
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);

export const env = { PORT, JWT_SECRET, CORS_ORIGINS };