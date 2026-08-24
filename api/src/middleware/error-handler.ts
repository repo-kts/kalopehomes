import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { HttpError } from '../utils/http-error';

/**
 * Central error handler. Must be registered LAST, after all routes.
 * Express identifies it by its four-argument signature.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Unknown error';

  if (!isHttpError || statusCode >= 500) {
    // Unexpected error — log the full stack for observability.
    console.error(err);
  }

  res.status(statusCode).json({
    error: isHttpError ? err.name : 'InternalServerError',
    message: statusCode >= 500 && env.isProduction ? 'Internal Server Error' : message,
    ...(isHttpError && err.details ? { details: err.details } : {}),
  });
}
