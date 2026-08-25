import type { Request, Response } from 'express';

import { getCurrentUser, login } from './auth.service';

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const result = await login(req.body);
  res.json(result);
}

export async function meHandler(req: Request, res: Response): Promise<void> {
  const user = await getCurrentUser(req.auth!.userId);
  res.json({ user });
}
