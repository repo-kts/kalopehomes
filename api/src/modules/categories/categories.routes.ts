import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { contentStatus, slugField, urlField } from '../../lib/validators';

const base = {
  name: z.string().trim().min(1),
  slug: slugField,
  description: z.string().trim().optional(),
  imageUrl: urlField,
  iconUrl: urlField,
  sortOrder: z.number().int().optional(),
  status: contentStatus.optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  parentId: z.uuid().nullable().optional(),
};

const createSchema = z.object(base);
const updateSchema = z.object(base).partial();

export const categoriesRouter = crudRouter({
  model: prisma.category,
  label: 'Category',
  createSchema,
  updateSchema,
  permissions: {
    read: PERMISSIONS.CATEGORY_READ,
    write: PERMISSIONS.CATEGORY_WRITE,
    delete: PERMISSIONS.CATEGORY_DELETE,
  },
  searchable: ['name', 'slug'],
  filterable: ['status', 'parentId', 'isFeatured'],
  sortable: ['name', 'sortOrder', 'createdAt'],
  defaultOrderBy: { sortOrder: 'asc' },
  include: { parent: true, _count: { select: { children: true, products: true } } },
});
