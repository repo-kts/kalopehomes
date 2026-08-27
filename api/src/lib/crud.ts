import { Router } from 'express';
import type { ZodType } from 'zod';

import { asyncHandler } from '../middleware/async-handler';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { HttpError } from '../utils/http-error';
import {
  buildMeta,
  listQuerySchema,
  paginationArgs,
  parseSort,
  type ListQuery,
} from './pagination';

/**
 * Minimal shape of a Prisma model delegate the factory relies on.
 * Args are `any` because Prisma's generated delegates use heavily constrained
 * generic overloads that don't unify with a hand-written structural type.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModelDelegate {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface CrudOptions {
  model: ModelDelegate;
  /** Human label used in error messages, e.g. "Category". */
  label: string;
  createSchema: ZodType;
  updateSchema: ZodType;
  permissions: { read: string; write: string; delete: string };
  /** Fields matched (case-insensitive contains) by the `q` search param. */
  searchable?: string[];
  /** Query keys applied as exact `where` equality filters. */
  filterable?: string[];
  /** Fields allowed in `?sort=field:dir`. */
  sortable?: string[];
  defaultOrderBy?: Record<string, 'asc' | 'desc'>;
  /** Relations to include on every response. */
  include?: unknown;
}

function buildWhere(query: ListQuery, rawQuery: Record<string, unknown>, opts: CrudOptions) {
  const where: Record<string, unknown> = {};

  if (query.q && opts.searchable?.length) {
    where.OR = opts.searchable.map((field) => ({
      [field]: { contains: query.q, mode: 'insensitive' },
    }));
  }

  for (const key of opts.filterable ?? []) {
    const value = rawQuery[key];
    if (value !== undefined && value !== '') {
      if (value === 'true') where[key] = true;
      else if (value === 'false') where[key] = false;
      else where[key] = value;
    }
  }

  return where;
}

/**
 * Builds a REST router (list/get/create/update/delete) for a Prisma model.
 * Every route is authenticated and permission-guarded.
 */
export function crudRouter(opts: CrudOptions): Router {
  const router = Router();
  const orderBy = opts.defaultOrderBy ?? { createdAt: 'desc' as const };

  // LIST
  router.get(
    '/',
    authenticate,
    authorize(opts.permissions.read),
    validate({ query: listQuerySchema }),
    asyncHandler(async (req, res) => {
      const query = req.query as unknown as ListQuery;
      const where = buildWhere(query, req.query as Record<string, unknown>, opts);
      const [data, total] = await Promise.all([
        opts.model.findMany({
          where,
          include: opts.include,
          orderBy: parseSort(query.sort, opts.sortable ?? [], orderBy),
          ...paginationArgs(query),
        }),
        opts.model.count({ where }),
      ]);
      res.json({ data, meta: buildMeta(total, query) });
    }),
  );

  // GET ONE
  router.get(
    '/:id',
    authenticate,
    authorize(opts.permissions.read),
    asyncHandler(async (req, res) => {
      const record = await opts.model.findUnique({
        where: { id: req.params.id },
        include: opts.include,
      });
      if (!record) throw new HttpError(404, `${opts.label} not found`);
      res.json({ data: record });
    }),
  );

  // CREATE
  router.post(
    '/',
    authenticate,
    authorize(opts.permissions.write),
    validate({ body: opts.createSchema }),
    asyncHandler(async (req, res) => {
      const record = await opts.model.create({ data: req.body, include: opts.include });
      res.status(201).json({ data: record });
    }),
  );

  // UPDATE
  router.patch(
    '/:id',
    authenticate,
    authorize(opts.permissions.write),
    validate({ body: opts.updateSchema }),
    asyncHandler(async (req, res) => {
      const record = await opts.model.update({
        where: { id: req.params.id },
        data: req.body,
        include: opts.include,
      });
      res.json({ data: record });
    }),
  );

  // DELETE
  router.delete(
    '/:id',
    authenticate,
    authorize(opts.permissions.delete),
    asyncHandler(async (req, res) => {
      await opts.model.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  );

  return router;
}
