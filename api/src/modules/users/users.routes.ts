import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { hashPassword } from '../../lib/password';
import {
  buildMeta,
  listQuerySchema,
  paginationArgs,
  parseSort,
  type ListQuery,
} from '../../lib/pagination';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { urlField } from '../../lib/validators';
import { HttpError } from '../../utils/http-error';

const publicSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatarUrl: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true, slug: true } },
};

const createSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().trim().optional(),
  avatarUrl: urlField,
  roleId: z.uuid(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.email().transform((v) => v.toLowerCase().trim()).optional(),
  password: z.string().min(8).optional(),
  phone: z.string().trim().nullable().optional(),
  avatarUrl: urlField,
  roleId: z.uuid().optional(),
  isActive: z.boolean().optional(),
});

export const usersRouter = Router();

usersRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.USER_READ),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as ListQuery & { roleId?: string; isActive?: string };
    const where: Record<string, unknown> = {};
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.roleId) where.roleId = query.roleId;
    if (query.isActive === 'true') where.isActive = true;
    if (query.isActive === 'false') where.isActive = false;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: publicSelect,
        orderBy: parseSort(query.sort, ['name', 'createdAt'], { createdAt: 'desc' }),
        ...paginationArgs(query),
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ data, meta: buildMeta(total, query) });
  }),
);

usersRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.USER_READ),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: publicSelect,
    });
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ data: user });
  }),
);

usersRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.USER_WRITE),
  validate({ body: createSchema }),
  asyncHandler(async (req, res) => {
    const { password, ...rest } = req.body as z.infer<typeof createSchema>;
    const existing = await prisma.user.findUnique({ where: { email: rest.email } });
    if (existing) throw new HttpError(409, 'A user with this email already exists');

    const user = await prisma.user.create({
      data: { ...rest, passwordHash: await hashPassword(password) },
      select: publicSelect,
    });
    res.status(201).json({ data: user });
  }),
);

usersRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.USER_WRITE),
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    const { password, ...rest } = req.body as z.infer<typeof updateSchema>;
    const data: Record<string, unknown> = { ...rest };
    if (password) data.passwordHash = await hashPassword(password);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: publicSelect,
    });
    res.json({ data: user });
  }),
);

usersRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.USER_DELETE),
  asyncHandler(async (req, res) => {
    if (req.auth!.userId === req.params.id) {
      throw new HttpError(400, 'You cannot delete your own account');
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
