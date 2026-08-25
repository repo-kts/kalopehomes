import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';

const upsertSchema = z.object({
  value: z.unknown(),
  group: z.string().trim().optional(),
});

export const settingsRouter = Router();

// List all settings (optionally filtered by group).
settingsRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.CONTENT_READ),
  asyncHandler(async (req, res) => {
    const group = typeof req.query.group === 'string' ? req.query.group : undefined;
    const data = await prisma.setting.findMany({
      where: group ? { group } : undefined,
      orderBy: { key: 'asc' },
    });
    res.json({ data });
  }),
);

settingsRouter.get(
  '/:key',
  authenticate,
  authorize(PERMISSIONS.CONTENT_READ),
  asyncHandler(async (req, res) => {
    const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
    if (!setting) throw new HttpError(404, 'Setting not found');
    res.json({ data: setting });
  }),
);

// Upsert a setting by key.
settingsRouter.put(
  '/:key',
  authenticate,
  authorize(PERMISSIONS.CONTENT_WRITE),
  validate({ body: upsertSchema }),
  asyncHandler(async (req, res) => {
    const { value, group } = req.body as z.infer<typeof upsertSchema>;
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      create: { key: req.params.key, value: value as object, group },
      update: { value: value as object, group },
    });
    res.json({ data: setting });
  }),
);

settingsRouter.delete(
  '/:key',
  authenticate,
  authorize(PERMISSIONS.CONTENT_DELETE),
  asyncHandler(async (req, res) => {
    await prisma.setting.delete({ where: { key: req.params.key } });
    res.status(204).send();
  }),
);
