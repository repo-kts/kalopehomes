import type { Prisma } from '@prisma/client';

import {
  buildMeta,
  paginationArgs,
  parseSort,
  type ListQuery,
} from '../../lib/pagination';
import { prisma } from '../../lib/prisma';
import { generateReference } from '../../lib/reference';
import { HttpError } from '../../utils/http-error';
import type { CreateLeadInput, PublicLeadInput, UpdateLeadInput } from './leads.schema';

const detailInclude = {
  assignedTo: { select: { id: true, name: true, email: true } },
  category: { select: { id: true, name: true, slug: true } },
  product: { select: { id: true, name: true, slug: true } },
  activities: {
    orderBy: { createdAt: 'desc' as const },
    include: { createdBy: { select: { id: true, name: true } } },
  },
  quotes: { orderBy: { createdAt: 'desc' as const } },
} satisfies Prisma.LeadInclude;

export interface LeadListFilters extends ListQuery {
  status?: string;
  type?: string;
  source?: string;
  assignedToId?: string;
}

export async function listLeads(query: LeadListFilters) {
  const where: Prisma.LeadWhereInput = {};
  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: 'insensitive' } },
      { email: { contains: query.q, mode: 'insensitive' } },
      { phone: { contains: query.q, mode: 'insensitive' } },
      { referenceNo: { contains: query.q, mode: 'insensitive' } },
    ];
  }
  if (query.status) where.status = query.status as Prisma.EnumLeadStatusFilter['equals'];
  if (query.type) where.type = query.type as Prisma.EnumLeadTypeFilter['equals'];
  if (query.source) where.source = query.source as Prisma.EnumLeadSourceFilter['equals'];
  if (query.assignedToId) where.assignedToId = query.assignedToId;

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { quotes: true, activities: true } },
      },
      orderBy: parseSort(query.sort, ['createdAt', 'status'], { createdAt: 'desc' }),
      ...paginationArgs(query),
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, meta: buildMeta(total, query) };
}

export async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({ where: { id }, include: detailInclude });
  if (!lead) throw new HttpError(404, 'Lead not found');
  return lead;
}

export async function createLead(input: CreateLeadInput | PublicLeadInput) {
  return prisma.lead.create({
    data: { ...input, referenceNo: generateReference('LD') },
    include: detailInclude,
  });
}

export async function updateLead(id: string, input: UpdateLeadInput, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.lead.findUnique({ where: { id }, select: { status: true } });
    if (!existing) throw new HttpError(404, 'Lead not found');

    await tx.lead.update({ where: { id }, data: input });

    // Record a status change on the timeline for auditability.
    if (input.status && input.status !== existing.status) {
      await tx.leadActivity.create({
        data: {
          leadId: id,
          type: 'STATUS_CHANGE',
          note: `Status changed from ${existing.status} to ${input.status}`,
          createdById: actorId,
        },
      });
    }

    // Re-read with relations so the response reflects any new activity.
    return tx.lead.findUniqueOrThrow({ where: { id }, include: detailInclude });
  });
}

export async function addActivity(
  leadId: string,
  data: { type: string; note?: string },
  actorId: string,
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!lead) throw new HttpError(404, 'Lead not found');

  return prisma.leadActivity.create({
    data: {
      leadId,
      type: data.type as Prisma.LeadActivityCreateInput['type'],
      note: data.note,
      createdById: actorId,
    },
    include: { createdBy: { select: { id: true, name: true } } },
  });
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
}
