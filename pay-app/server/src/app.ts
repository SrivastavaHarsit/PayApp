import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './env';
import { errorHandler } from './middleware/error';
import authRoutes from './auth/auth.routes';
import accountRoutes from './account/account.routes';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: env.CORS_ORIGINS.length ? env.CORS_ORIGINS : [/^http:\/\/localhost:\d+$/],
  credentials: true
}));

app.use('/api/v1/user', authRoutes);
app.use('/api/v1/account', accountRoutes);

app.use(errorHandler);

export default app;