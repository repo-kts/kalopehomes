import { Router } from 'express';
import { z } from 'zod';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  buildMeta,
  listQuerySchema,
  paginationArgs,
  parseSort,
  type ListQuery,
} from '../../lib/pagination';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { contentStatus, slugField, urlField } from '../../lib/validators';
import { HttpError } from '../../utils/http-error';

const imageSchema = z.object({
  url: z.url(),
  alt: z.string().trim().optional(),
  sortOrder: z.number().int().optional(),
});

const base = {
  title: z.string().trim().min(1),
  slug: slugField,
  location: z.string().trim().optional(),
  area: z.string().trim().optional(),
  configuration: z.string().trim().optional(),
  description: z.string().trim().optional(),
  coverImageUrl: urlField,
  status: contentStatus.optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryId: z.uuid().nullable().optional(),
  images: z.array(imageSchema).optional(),
};

const createSchema = z.object(base);
const updateSchema = z.object(base).partial();

const include = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
};

export const projectsRouter = Router();

projectsRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.CONTENT_READ),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as ListQuery & { status?: string; categoryId?: string };
    const where: Record<string, unknown> = {};
    if (query.q) where.title = { contains: query.q, mode: 'insensitive' };
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include,
        orderBy: parseSort(query.sort, ['title', 'sortOrder', 'createdAt'], { sortOrder: 'asc' }),
        ...paginationArgs(query),
      }),
      prisma.project.count({ where }),
    ]);
    res.json({ data, meta: buildMeta(total, query) });
  }),
);

projectsRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.CONTENT_READ),
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({ where: { id: req.params.id }, include });
    if (!project) throw new HttpError(404, 'Project not found');
    res.json({ data: project });
  }),
);

projectsRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.CONTENT_WRITE),
  validate({ body: createSchema }),
  asyncHandler(async (req, res) => {
    const { images, ...scalars } = req.body as z.infer<typeof createSchema>;
    const project = await prisma.project.create({
      data: { ...scalars, images: images?.length ? { create: images } : undefined },
      include,
    });
    res.status(201).json({ data: project });
  }),
);

projectsRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.CONTENT_WRITE),
  validate({ body: updateSchema }),
  asyncHandler(async (req, res) => {
    const { images, ...scalars } = req.body as z.infer<typeof updateSchema>;
    const project = await prisma.$transaction(async (tx) => {
      const exists = await tx.project.findUnique({
        where: { id: req.params.id },
        select: { id: true },
      });
      if (!exists) throw new HttpError(404, 'Project not found');
      if (images) await tx.projectImage.deleteMany({ where: { projectId: req.params.id } });
      return tx.project.update({
        where: { id: req.params.id },
        data: { ...scalars, images: images?.length ? { create: images } : undefined },
        include,
      });
    });
    res.json({ data: project });
  }),
);

projectsRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.CONTENT_DELETE),
  asyncHandler(async (req, res) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);
