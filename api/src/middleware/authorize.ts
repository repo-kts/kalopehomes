import type { NextFunction, Request, Response } from 'express';

import { hasPermission } from '../lib/permissions';
import { HttpError } from '../utils/http-error';

/**
 * Guards a route by requiring the authenticated user to hold ALL of the given
 * permissions. Must run after `authenticate`.
 */
export function authorize(...required: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    const missing = required.filter((p) => !hasPermission(req.auth!.permissions, p));
    if (missing.length > 0) {
      next(new HttpError(403, `Forbidden: missing permission(s) ${missing.join(', ')}`));
      return;
    }

    next();
  };
}
