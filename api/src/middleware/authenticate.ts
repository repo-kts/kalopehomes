import type { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { HttpError } from '../utils/http-error';

/**
 * Verifies the Bearer token, loads the (still-active) user and their role's
 * permissions, and attaches an `auth` context to the request.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Missing or malformed Authorization header');
    }

    const token = header.slice('Bearer '.length).trim();
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      throw new HttpError(401, 'User no longer active');
    }

    req.auth = {
      userId: user.id,
      email: user.email,
      roleSlug: user.role.slug,
      permissions: user.role.permissions,
    };

    next();
  } catch (err) {
    if (err instanceof HttpError) {
      next(err);
    } else {
      next(new HttpError(401, 'Invalid or expired token'));
    }
  }
}
