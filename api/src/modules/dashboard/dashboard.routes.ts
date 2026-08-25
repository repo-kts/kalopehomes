import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { prisma } from '../../lib/prisma';

export const dashboardRouter = Router();

/** Aggregated counts + recent leads for the admin home screen. */
dashboardRouter.get(
  '/stats',
  authenticate,
  asyncHandler(async (_req, res) => {
    const [
      totalProducts,
      publishedProducts,
      totalCategories,
      totalProjects,
      leadsByStatus,
      totalLeads,
      newLeads,
      recentLeads,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.category.count(),
      prisma.project.count(),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceNo: true,
          name: true,
          phone: true,
          status: true,
          type: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      data: {
        catalog: { totalProducts, publishedProducts, totalCategories, totalProjects },
        leads: {
          total: totalLeads,
          new: newLeads,
          byStatus: leadsByStatus.map((r) => ({ status: r.status, count: r._count._all })),
        },
        recentLeads,
      },
    });
  }),
);
