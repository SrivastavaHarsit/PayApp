import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Server running (TypeScript)' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});
