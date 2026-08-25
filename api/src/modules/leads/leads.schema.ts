import { z } from 'zod';

export const leadType = z.enum(['CONSULTATION', 'QUOTE_REQUEST', 'CONTACT', 'CALLBACK']);
export const leadSource = z.enum([
  'WEBSITE',
  'PHONE',
  'REFERRAL',
  'WALK_IN',
  'SOCIAL',
  'CAMPAIGN',
  'OTHER',
]);
export const leadStatus = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
]);
export const activityType = z.enum([
  'NOTE',
  'CALL',
  'EMAIL',
  'WHATSAPP',
  'MEETING',
  'SITE_VISIT',
  'STATUS_CHANGE',
  'QUOTE_SENT',
]);

/** Fields a website visitor can submit (public intake). */
export const publicLeadSchema = z.object({
  type: leadType.optional(),
  name: z.string().trim().min(1),
  email: z.email().optional(),
  phone: z.string().trim().min(6),
  city: z.string().trim().optional(),
  message: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  budgetRange: z.string().trim().optional(),
  roomsInterested: z.array(z.string().trim()).optional(),
  categoryId: z.uuid().optional(),
  productId: z.uuid().optional(),
  preferredContactAt: z.coerce.date().optional(),
});

/** Additional fields the CRM/admin may set. */
export const createLeadSchema = publicLeadSchema.extend({
  source: leadSource.optional(),
  status: leadStatus.optional(),
  assignedToId: z.uuid().nullable().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const addActivitySchema = z.object({
  type: activityType.default('NOTE'),
  note: z.string().trim().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type PublicLeadInput = z.infer<typeof publicLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
