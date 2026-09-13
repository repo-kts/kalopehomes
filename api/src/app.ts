import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import { apiRouter } from './routes';
import { UPLOAD_DIR, UPLOAD_ROUTE } from './modules/uploads/uploads.routes';

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

  // Uploaded media. Helmet defaults Cross-Origin-Resource-Policy to
  // `same-origin`, which would stop the admin (a different origin) from
  // displaying these at all, so it is relaxed for this path only.
  app.use(
    UPLOAD_ROUTE,
    express.static(UPLOAD_DIR, {
      index: false,
      maxAge: '1y',
      setHeaders: (res) => res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'),
    }),
  );

  // Routes
  app.use('/', apiRouter);

  // 404 + centralised error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
