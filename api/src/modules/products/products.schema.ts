import { z } from 'zod';

import { contentStatus, slugField } from '../../lib/validators';

const imageSchema = z.object({
  url: z.url(),
  alt: z.string().trim().optional(),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

const base = {
  name: z.string().trim().min(1),
  slug: slugField,
  sku: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  startingPrice: z.number().nonnegative().nullable().optional(),
  priceUnit: z.string().trim().optional(),
  currency: z.string().trim().length(3).optional(),
  specs: z.record(z.string(), z.unknown()).nullable().optional(),
  status: contentStatus.optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  categoryId: z.uuid(),
  roomIds: z.array(z.uuid()).optional(),
  styleIds: z.array(z.uuid()).optional(),
  images: z.array(imageSchema).optional(),
};

export const createProductSchema = z.object(base);
export const updateProductSchema = z
  .object({ ...base, categoryId: z.uuid().optional() })
  .partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
