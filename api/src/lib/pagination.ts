import { z } from 'zod';

/** Common list query params: pagination + free-text search. */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  sort: z.string().trim().optional(), // e.g. "createdAt:desc"
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export function paginationArgs(query: ListQuery) {
  return {
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
  };
}

export function buildMeta(total: number, query: ListQuery) {
  return {
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

/** Parses "field:dir" into a Prisma orderBy object, falling back to a default. */
export function parseSort(
  sort: string | undefined,
  allowed: string[],
  fallback: Record<string, 'asc' | 'desc'>,
): Record<string, 'asc' | 'desc'> {
  if (!sort) return fallback;
  const [field, dir] = sort.split(':');
  if (!allowed.includes(field)) return fallback;
  return { [field]: dir === 'asc' ? 'asc' : 'desc' };
}
