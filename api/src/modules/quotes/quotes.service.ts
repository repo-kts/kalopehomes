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
import type { CreateQuoteInput, QuoteItemInput, UpdateQuoteInput } from './quotes.schema';

const include = {
  items: { orderBy: { sortOrder: 'asc' as const } },
  lead: { select: { id: true, referenceNo: true, name: true, phone: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.QuoteInclude;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Computes per-line amounts and the quote totals from raw inputs. */
function computeTotals(items: QuoteItemInput[], discount: number, taxPercent: number) {
  const lines = items.map((item) => ({
    ...item,
    amount: round2(item.quantity * item.unitPrice),
  }));
  const subtotal = round2(lines.reduce((sum, l) => sum + l.amount, 0));
  const taxable = Math.max(0, subtotal - discount);
  const taxAmount = round2((taxable * taxPercent) / 100);
  const total = round2(taxable + taxAmount);
  return { lines, subtotal, taxAmount, total };
}

export interface QuoteListFilters extends ListQuery {
  status?: string;
  leadId?: string;
}

export async function listQuotes(query: QuoteListFilters) {
  const where: Prisma.QuoteWhereInput = {};
  if (query.q) where.quoteNumber = { contains: query.q, mode: 'insensitive' };
  if (query.status) where.status = query.status as Prisma.EnumQuoteStatusFilter['equals'];
  if (query.leadId) where.leadId = query.leadId;

  const [data, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: { lead: { select: { id: true, referenceNo: true, name: true } } },
      orderBy: parseSort(query.sort, ['createdAt', 'status', 'total'], { createdAt: 'desc' }),
      ...paginationArgs(query),
    }),
    prisma.quote.count({ where }),
  ]);
  return { data, meta: buildMeta(total, query) };
}

export async function getQuote(id: string) {
  const quote = await prisma.quote.findUnique({ where: { id }, include });
  if (!quote) throw new HttpError(404, 'Quote not found');
  return quote;
}

export async function createQuote(input: CreateQuoteInput, actorId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: input.leadId }, select: { id: true } });
  if (!lead) throw new HttpError(400, 'Lead not found');

  const { lines, subtotal, taxAmount, total } = computeTotals(
    input.items,
    input.discount,
    input.taxPercent,
  );

  return prisma.quote.create({
    data: {
      quoteNumber: generateReference('QT'),
      leadId: input.leadId,
      status: input.status,
      discount: input.discount,
      taxPercent: input.taxPercent,
      currency: input.currency,
      notes: input.notes,
      validUntil: input.validUntil,
      subtotal,
      taxAmount,
      total,
      createdById: actorId,
      items: { create: lines },
    },
    include,
  });
}

export async function updateQuote(id: string, input: UpdateQuoteInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.quote.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) throw new HttpError(404, 'Quote not found');

    const discount = input.discount ?? Number(existing.discount);
    const taxPercent = input.taxPercent ?? Number(existing.taxPercent);

    const data: Prisma.QuoteUpdateInput = {
      status: input.status,
      discount: input.discount,
      taxPercent: input.taxPercent,
      currency: input.currency,
      notes: input.notes,
      validUntil: input.validUntil,
    };

    // If line items change (or amounts depend on discount/tax), recompute.
    if (input.items) {
      const { lines, subtotal, taxAmount, total } = computeTotals(input.items, discount, taxPercent);
      await tx.quoteItem.deleteMany({ where: { quoteId: id } });
      data.items = { create: lines };
      data.subtotal = subtotal;
      data.taxAmount = taxAmount;
      data.total = total;
    } else if (input.discount !== undefined || input.taxPercent !== undefined) {
      const currentItems: QuoteItemInput[] = existing.items.map((i) => ({
        title: i.title,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      }));
      const { subtotal, taxAmount, total } = computeTotals(currentItems, discount, taxPercent);
      data.subtotal = subtotal;
      data.taxAmount = taxAmount;
      data.total = total;
    }

    return tx.quote.update({ where: { id }, data, include });
  });
}

export async function deleteQuote(id: string) {
  await prisma.quote.delete({ where: { id } });
}
