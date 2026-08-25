import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { urlField } from '../../lib/validators';

const base = {
  authorName: z.string().trim().min(1),
  authorLocation: z.string().trim().optional(),
  authorAvatarUrl: urlField,
  rating: z.number().int().min(1).max(5).nullable().optional(),
  quote: z.string().trim().min(1),
  imageUrl: urlField,
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
};

export const testimonialsRouter = crudRouter({
  model: prisma.testimonial,
  label: 'Testimonial',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.CONTENT_READ,
    write: PERMISSIONS.CONTENT_WRITE,
    delete: PERMISSIONS.CONTENT_DELETE,
  },
  searchable: ['authorName', 'quote'],
  filterable: ['isActive'],
  sortable: ['sortOrder', 'createdAt'],
  defaultOrderBy: { sortOrder: 'asc' },
});
