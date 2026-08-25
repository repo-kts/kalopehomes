import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';

const base = {
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  category: z.string().trim().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
};

export const faqsRouter = crudRouter({
  model: prisma.faq,
  label: 'FAQ',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.CONTENT_READ,
    write: PERMISSIONS.CONTENT_WRITE,
    delete: PERMISSIONS.CONTENT_DELETE,
  },
  searchable: ['question', 'answer'],
  filterable: ['category', 'isActive'],
  sortable: ['sortOrder', 'createdAt'],
  defaultOrderBy: { sortOrder: 'asc' },
});
