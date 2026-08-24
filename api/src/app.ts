import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import { apiRouter } from './routes';

/**
 * Builds and configures the Express application.
 * Kept separate from the HTTP server so it can be imported directly in tests.
 */
export function createApp(): Express {
  const app = express();

  // Security & platform middleware
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  // Routes
  app.use('/', apiRouter);

  // 404 + centralised error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
