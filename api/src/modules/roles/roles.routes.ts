import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ALL_PERMISSIONS, PERMISSIONS, WILDCARD } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { slugField } from '../../lib/validators';
import { HttpError } from '../../utils/http-error';

const validPermission = z.enum([WILDCARD, ...ALL_PERMISSIONS] as [string, ...string[]]);

const createSchema = z.object({
  name: z.string().trim().min(1),
  slug: slugField,
  description: z.string().trim().optional(),
  permissions: z.array(validPermission).default([]),
});

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().nullable().optional(),
  permissions: z.array(validPermission).optional(),
});

export const rolesRouter = Router();

// Expose the permission catalog so the admin UI can render a picker.
rolesRouter.get(
  '/permissions',
  authenticate,
  authorize(PERMISSIONS.ROLE_READ),
  asyncHandler(async (_req, res) => {
    res.json({ data: { wildcard: WILDCARD, permissions: ALL_PERMISSIONS } });
  }),
);

rolesRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.ROLE_READ),
  asyncHandler(async (_req, res) => {
    const data = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { users: true } } },
    });
    res.json({ data });
  }),
);

rolesRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.ROLE_READ),
  asyncHandler(async (req, res) => {
    const role = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!role) throw new HttpError(404, 'Role not found');
    res.json({ data: role });
  }),
);

rolesRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.ROLE_WRITE),
  validate({ body: createSchema }),
  asyncHandler(async (req, res) => {
    const role = await prisma.role.create({ data: req.body });
    res.status(201).json({ data: role });
  }),
);

rolesRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.ROLE_WRITE),
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    const existing = await prisma.role.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new HttpError(404, 'Role not found');
    const role = await prisma.role.update({ where: { id: req.params.id }, data: req.body });
    res.json({ data: role });
  }),
);

rolesRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.ROLE_WRITE),
  asyncHandler(async (req, res) => {
    const role = await prisma.role.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { users: true } } },
    });
    if (!role) throw new HttpError(404, 'Role not found');
    if (role.isSystem) throw new HttpError(400, 'System roles cannot be deleted');
    if (role._count.users > 0) {
      throw new HttpError(400, 'Cannot delete a role that still has users assigned');
    }
    await prisma.role.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
