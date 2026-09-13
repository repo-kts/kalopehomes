import { createApp } from '../src/app';

/**
 * Vercel serverless entrypoint.
 *
 * Vercel's Node runtime invokes the default export as a `(req, res)` request
 * handler — and an Express `Application` instance is exactly that. All routes
 * are handled inside the Express app; `vercel.json` rewrites every path to
 * this function, so `req.url` still carries the original path (e.g.
 * `/api/v1/health`) and Express routing works unchanged.
 *
 * `src/index.ts` (the `app.listen(...)` server) remains the entrypoint for
 * local development and non-serverless hosts; it is not used here.
 */
export default createApp();
