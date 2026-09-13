import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.routes';
import { categoriesRouter } from '../modules/categories/categories.routes';
import { faqsRouter } from '../modules/content/faqs.routes';
import { galleryRouter } from '../modules/content/gallery.routes';
import { heroRouter } from '../modules/content/hero.routes';
import { projectsRouter } from '../modules/content/projects.routes';
import { settingsRouter } from '../modules/content/settings.routes';
import { testimonialsRouter } from '../modules/content/testimonials.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { leadsRouter } from '../modules/leads/leads.routes';
import { productsRouter } from '../modules/products/products.routes';
import { publicRouter } from '../modules/public/public.routes';
import { quotesRouter } from '../modules/quotes/quotes.routes';
import { rolesRouter } from '../modules/roles/roles.routes';
import { roomsRouter } from '../modules/rooms/rooms.routes';
import { stylesRouter } from '../modules/styles/styles.routes';
import { uploadsRouter } from '../modules/uploads/uploads.routes';
import { usersRouter } from '../modules/users/users.routes';
import { healthRouter } from './health.route';

/** Aggregates all feature routers behind a single mount point. */
export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'Kalope Homes API' });
});

apiRouter.use(healthRouter);

// --- API v1 -------------------------------------------------------------
const v1 = Router();

// Public (web-facing, unauthenticated) surface.
v1.use('/public', publicRouter);

// Auth.
v1.use(authRouter);

// Admin / CRM (authenticated + permission-guarded) surface.
v1.use('/dashboard', dashboardRouter);
v1.use('/users', usersRouter);
v1.use('/roles', rolesRouter);
v1.use('/categories', categoriesRouter);
v1.use('/products', productsRouter);
v1.use('/rooms', roomsRouter);
v1.use('/styles', stylesRouter);
v1.use('/hero-slides', heroRouter);
v1.use('/testimonials', testimonialsRouter);
v1.use('/projects', projectsRouter);
v1.use('/gallery', galleryRouter);
v1.use('/faqs', faqsRouter);
v1.use('/settings', settingsRouter);
v1.use('/uploads', uploadsRouter);
v1.use('/leads', leadsRouter);
v1.use('/quotes', quotesRouter);

apiRouter.use('/api/v1', v1);
