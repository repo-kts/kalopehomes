import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { listQuerySchema } from '../../lib/pagination';
import { PERMISSIONS } from '../../lib/permissions';
import { createQuoteSchema, updateQuoteSchema } from './quotes.schema';
import {
  createQuote,
  deleteQuote,
  getQuote,
  listQuotes,
  updateQuote,
  type QuoteListFilters,
} from './quotes.service';

export const quotesRouter = Router();

quotesRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.QUOTE_READ),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    res.json(await listQuotes(req.query as unknown as QuoteListFilters));
  }),
);

quotesRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.QUOTE_READ),
  asyncHandler(async (req, res) => {
    res.json({ data: await getQuote(req.params.id) });
  }),
);

quotesRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.QUOTE_WRITE),
  validate({ body: createQuoteSchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await createQuote(req.body, req.auth!.userId) });
  }),
);

quotesRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.QUOTE_WRITE),
  validate({ body: updateQuoteSchema }),
  asyncHandler(async (req, res) => {
    res.json({ data: await updateQuote(req.params.id, req.body) });
  }),
);

quotesRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.QUOTE_DELETE),
  asyncHandler(async (req, res) => {
    await deleteQuote(req.params.id);
    res.status(204).send();
  }),
);
