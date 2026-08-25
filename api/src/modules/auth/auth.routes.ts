import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { loginHandler, meHandler } from './auth.controller';
import { loginSchema } from './auth.schema';

export const authRouter = Router();

authRouter.post('/auth/login', validate({ body: loginSchema }), asyncHandler(loginHandler));
authRouter.get('/auth/me', authenticate, asyncHandler(meHandler));
