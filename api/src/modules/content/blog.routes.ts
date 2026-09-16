import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { contentStatus, urlField } from '../../lib/validators';

const base = {
  thumbnailUrl: urlField,
  topic: z.string().trim().min(1),
  categoryId: z.string().uuid().nullable().optional(),
  content: z.string().trim().min(1),
  status: contentStatus.optional(),
};

export const blogRouter = crudRouter({
  model: prisma.blog,
  label: 'Blog post',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.CONTENT_READ,
    write: PERMISSIONS.CONTENT_WRITE,
    delete: PERMISSIONS.CONTENT_DELETE,
  },
  include: { category: true },
  searchable: ['topic', 'content'],
  filterable: ['status', 'categoryId'],
  sortable: ['topic', 'createdAt', 'updatedAt'],
  defaultOrderBy: { createdAt: 'desc' },
});