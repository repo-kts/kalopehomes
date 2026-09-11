import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { contentStatus } from '../../lib/validators';

const base = {
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  // Not `urlField`: that permits '' and undefined, which Prisma rejects for a
  // String[] column. Every entry here must be a real URL.
  imageUrls: z.array(z.url()).default([]),
  status: contentStatus.optional(),
  isFeatured: z.boolean().optional(),
};

export const galleryRouter = crudRouter({
  model: prisma.gallery,
  label: 'Gallery item',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.CONTENT_READ,
    write: PERMISSIONS.CONTENT_WRITE,
    delete: PERMISSIONS.CONTENT_DELETE,
  },
  searchable: ['title', 'description'],
  filterable: ['status', 'isFeatured'],
  sortable: ['title', 'createdAt'],
  defaultOrderBy: { createdAt: 'desc' },
});