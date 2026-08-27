import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { urlField } from '../../lib/validators';

const placement = z.enum(['HOME_HERO', 'HOME_PROMO', 'CATEGORY_HEADER']);

const base = {
  title: z.string().trim().min(1),
  subtitle: z.string().trim().optional(),
  imageUrl: z.url(),
  mobileImageUrl: urlField,
  ctaText: z.string().trim().optional(),
  ctaLink: z.string().trim().optional(),
  placement: placement.optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
};

export const heroRouter = crudRouter({
  model: prisma.heroSlide,
  label: 'Hero slide',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.CONTENT_READ,
    write: PERMISSIONS.CONTENT_WRITE,
    delete: PERMISSIONS.CONTENT_DELETE,
  },
  searchable: ['title'],
  filterable: ['placement', 'isActive'],
  sortable: ['sortOrder', 'createdAt'],
  defaultOrderBy: { sortOrder: 'asc' },
});
