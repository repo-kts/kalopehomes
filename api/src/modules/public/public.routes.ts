import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { validate } from '../../middleware/validate';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import { createLead } from '../leads/leads.service';
import { publicLeadSchema } from '../leads/leads.schema';

/**
 * Unauthenticated, read-only surface for the WEB app plus the lead intake
 * endpoint. Only PUBLISHED / active content is ever exposed here.
 */
export const publicRouter = Router();

// ---- Categories --------------------------------------------------------
publicRouter.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const data = await prisma.category.findMany({
      where: { status: 'PUBLISHED', parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    res.json({ data });
  }),
);

publicRouter.get(
  '/categories/:slug',
  asyncHandler(async (req, res) => {
    const category = await prisma.category.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: { children: { where: { status: 'PUBLISHED' }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!category) throw new HttpError(404, 'Category not found');
    res.json({ data: category });
  }),
);

// ---- Products ----------------------------------------------------------
publicRouter.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { category, room, style, featured } = req.query as Record<string, string | undefined>;
    const data = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category ? { category: { slug: category } } : {}),
        ...(room ? { rooms: { some: { room: { slug: room } } } } : {}),
        ...(style ? { styles: { some: { style: { slug: style } } } } : {}),
        ...(featured === 'true' ? { isFeatured: true } : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        rooms: { include: { room: { select: { id: true, name: true, slug: true } } } },
        styles: { include: { style: { select: { id: true, name: true, slug: true } } } },
      },
    });
    res.json({ data });
  }),
);

publicRouter.get(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        rooms: { include: { room: { select: { id: true, name: true, slug: true } } } },
        styles: { include: { style: { select: { id: true, name: true, slug: true } } } },
      },
    });
    if (!product) throw new HttpError(404, 'Product not found');
    res.json({ data: product });
  }),
);

// ---- Taxonomies --------------------------------------------------------
publicRouter.get(
  '/rooms',
  asyncHandler(async (_req, res) => {
    res.json({
      data: await prisma.room.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    });
  }),
);

publicRouter.get(
  '/styles',
  asyncHandler(async (_req, res) => {
    res.json({
      data: await prisma.style.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    });
  }),
);

// ---- CMS content -------------------------------------------------------
publicRouter.get(
  '/hero',
  asyncHandler(async (req, res) => {
    const placement = typeof req.query.placement === 'string' ? req.query.placement : 'HOME_HERO';
    const now = new Date();
    const data = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
        placement: placement as never,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ data });
  }),
);

publicRouter.get(
  '/testimonials',
  asyncHandler(async (_req, res) => {
    res.json({
      data: await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
    });
  }),
);

publicRouter.get(
  '/projects',
  asyncHandler(async (req, res) => {
    const featured = req.query.featured === 'true' ? { isFeatured: true } : {};
    const data = await prisma.project.findMany({
      where: { status: 'PUBLISHED', ...featured },
      orderBy: { sortOrder: 'asc' },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    res.json({ data });
  }),
);

publicRouter.get(
  '/projects/:slug',
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!project) throw new HttpError(404, 'Project not found');
    res.json({ data: project });
  }),
);

publicRouter.get(
  '/gallery',
  asyncHandler(async (req, res) => {
    const featured = req.query.featured === 'true' ? { isFeatured: true } : {};
    const data = await prisma.gallery.findMany({
      where: { status: 'PUBLISHED', ...featured },
      // Featured items lead the wall; newest first after that.
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ data });
  }),
);

publicRouter.get(
  '/faqs',
  asyncHandler(async (_req, res) => {
    res.json({
      data: await prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    });
  }),
);

publicRouter.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.setting.findMany();
    // Return as a flat key -> value map for easy consumption on the web.
    const data = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json({ data });
  }),
);

// ---- Lead intake (the quotation entry point) ---------------------------
publicRouter.post(
  '/leads',
  validate({ body: publicLeadSchema }),
  asyncHandler(async (req, res) => {
    const lead = await createLead({ ...req.body, source: 'WEBSITE' });
    res.status(201).json({ data: { id: lead.id, referenceNo: lead.referenceNo } });
  }),
);
