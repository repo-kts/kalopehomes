import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { listQuerySchema } from '../../lib/pagination';
import { PERMISSIONS } from '../../lib/permissions';
import { addActivitySchema, createLeadSchema, updateLeadSchema } from './leads.schema';
import {
  addActivity,
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
  type LeadListFilters,
} from './leads.service';

export const leadsRouter = Router();

leadsRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.LEAD_READ),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    res.json(await listLeads(req.query as unknown as LeadListFilters));
  }),
);

leadsRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.LEAD_READ),
  asyncHandler(async (req, res) => {
    res.json({ data: await getLead(req.params.id) });
  }),
);

leadsRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.LEAD_WRITE),
  validate({ body: createLeadSchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await createLead(req.body) });
  }),
);

leadsRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.LEAD_WRITE),
  validate({ body: updateLeadSchema }),
  asyncHandler(async (req, res) => {
    res.json({ data: await updateLead(req.params.id, req.body, req.auth!.userId) });
  }),
);

leadsRouter.post(
  '/:id/activities',
  authenticate,
  authorize(PERMISSIONS.LEAD_WRITE),
  validate({ body: addActivitySchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await addActivity(req.params.id, req.body, req.auth!.userId) });
  }),
);

leadsRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.LEAD_DELETE),
  asyncHandler(async (req, res) => {
    await deleteLead(req.params.id);
    res.status(204).send();
  }),
);
