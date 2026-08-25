import { z } from 'zod';

import { crudRouter } from '../../lib/crud';
import { PERMISSIONS } from '../../lib/permissions';
import { prisma } from '../../lib/prisma';
import { slugField, urlField } from '../../lib/validators';

const base = {
  name: z.string().trim().min(1),
  slug: slugField,
  description: z.string().trim().optional(),
  imageUrl: urlField,
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
};

export const roomsRouter = crudRouter({
  model: prisma.room,
  label: 'Room',
  createSchema: z.object(base),
  updateSchema: z.object(base).partial(),
  permissions: {
    read: PERMISSIONS.TAXONOMY_READ,
    write: PERMISSIONS.TAXONOMY_WRITE,
    delete: PERMISSIONS.TAXONOMY_DELETE,
  },
  searchable: ['name', 'slug'],
  filterable: ['isActive'],
  sortable: ['name', 'sortOrder', 'createdAt'],
  defaultOrderBy: { sortOrder: 'asc' },
});
