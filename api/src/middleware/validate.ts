import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { HttpError } from '../utils/http-error';

type Schemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

/**
 * Validates and coerces request parts against Zod schemas. On success the
 * parsed values replace the originals so handlers get typed, trimmed data.
 */
export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query) {
        // req.query has only a getter in Express 5-style typings; mutate in place.
        Object.assign(req.query, schemas.query.parse(req.query));
      }
      if (schemas.body) req.body = schemas.body.parse(req.body);
      next();
    } catch (err) {
      const zerr = err as { issues?: unknown };
      if (zerr && Array.isArray(zerr.issues)) {
        next(new HttpError(400, 'Validation failed', zerr.issues));
      } else {
        next(err);
      }
    }
  };
}
