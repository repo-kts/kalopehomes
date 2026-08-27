import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { listQuerySchema } from '../../lib/pagination';
import { PERMISSIONS } from '../../lib/permissions';
import { createProductSchema, updateProductSchema } from './products.schema';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
  type ProductListFilters,
} from './products.service';

export const productsRouter = Router();

productsRouter.get(
  '/',
  authenticate,
  authorize(PERMISSIONS.PRODUCT_READ),
  validate({ query: listQuerySchema }),
  asyncHandler(async (req, res) => {
    const result = await listProducts(req.query as unknown as ProductListFilters);
    res.json(result);
  }),
);

productsRouter.get(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.PRODUCT_READ),
  asyncHandler(async (req, res) => {
    res.json({ data: await getProduct(req.params.id) });
  }),
);

productsRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.PRODUCT_WRITE),
  validate({ body: createProductSchema }),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await createProduct(req.body) });
  }),
);

productsRouter.patch(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.PRODUCT_WRITE),
  validate({ body: updateProductSchema }),
  asyncHandler(async (req, res) => {
    res.json({ data: await updateProduct(req.params.id, req.body) });
  }),
);

productsRouter.delete(
  '/:id',
  authenticate,
  authorize(PERMISSIONS.PRODUCT_DELETE),
  asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id);
    res.status(204).send();
  }),
);
