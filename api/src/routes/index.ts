import { Router } from 'express';

import { healthRouter } from './health.route';

/** Aggregates all feature routers behind a single mount point. */
export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'Kalope Homes API' });
});

apiRouter.use(healthRouter);
