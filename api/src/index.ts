import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'kalopehomes-api', timestamp: new Date().toISOString() });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Kalope Homes API' });
});

app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
