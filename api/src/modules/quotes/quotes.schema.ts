import { z } from 'zod';

export const quoteStatus = z.enum([
  'DRAFT',
  'SENT',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
  'REVISED',
]);

const itemSchema = z.object({
  productId: z.uuid().nullable().optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  quantity: z.number().positive().default(1),
  unit: z.string().trim().optional(),
  unitPrice: z.number().nonnegative().default(0),
  sortOrder: z.number().int().optional(),
});

export const createQuoteSchema = z.object({
  leadId: z.uuid(),
  status: quoteStatus.optional(),
  discount: z.number().nonnegative().default(0),
  taxPercent: z.number().min(0).max(100).default(0),
  currency: z.string().trim().length(3).optional(),
  notes: z.string().trim().optional(),
  validUntil: z.coerce.date().nullable().optional(),
  items: z.array(itemSchema).min(1, 'A quote needs at least one line item'),
});

export const updateQuoteSchema = z.object({
  status: quoteStatus.optional(),
  discount: z.number().nonnegative().optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  currency: z.string().trim().length(3).optional(),
  notes: z.string().trim().nullable().optional(),
  validUntil: z.coerce.date().nullable().optional(),
  items: z.array(itemSchema).min(1).optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type QuoteItemInput = z.infer<typeof itemSchema>;
