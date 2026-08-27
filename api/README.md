# Kalope Homes — API

Node.js + Express + TypeScript API backed by **PostgreSQL (Prisma)**. It powers
the **admin** console (content + CRM management) and serves the **web** app a
read-only public surface. The domain follows a **quotation architecture**
(Livspace-style): there is no cart/checkout — website visitors submit inquiries
that become **leads**, which sales staff convert into **quotes**.

## Stack

- Express 4 + TypeScript
- Prisma 6 ORM → PostgreSQL
- JWT auth (`bcryptjs` for hashing) with role-based permissions
- Zod request validation

## Getting started

```bash
cp .env.example .env          # then edit DATABASE_URL / JWT_SECRET
npm install
npm run db:migrate            # apply migrations (creates tables)
npm run db:seed               # roles + super admin + sample data
npm run dev                   # http://localhost:4000
```

Default super admin (from `.env`): `admin@kalopehomes.com` / `Admin@12345`.

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start API with hot reload |
| `npm run db:migrate` | Create/apply a dev migration |
| `npm run db:seed` | Seed roles, admin, sample catalog & CMS |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop, re-migrate and re-seed |
| `npm run typecheck` / `lint` | Static checks |

## Data model

```
RBAC        User ─▶ Role (permissions: string[])
Catalog     Category (self-nested) ─▶ Product ─▶ ProductImage
                                       Product ─▶ Room  (m2m)
                                       Product ─▶ Style (m2m)
CMS         HeroSlide · Testimonial · Project(+images) · Faq · Setting(kv)
Pipeline    Lead ─▶ LeadActivity (timeline)
            Lead ─▶ Quote ─▶ QuoteItem
```

See `prisma/schema.prisma` for the full definition.

## Auth & permissions

Every admin/CRM route requires `Authorization: Bearer <token>` and a permission.
Permissions are `resource:action` strings (`product:write`, `lead:read`, …); a
role holding `*` gets everything. Seeded roles: **super-admin, admin,
content-editor, sales-agent, viewer** (see `src/lib/permissions.ts`).

## API surface

Base path: `/api/v1`.

### Public (no auth — consumed by the web app)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/public/categories` | Published top-level categories (+children) |
| GET | `/public/categories/:slug` | One published category |
| GET | `/public/products` | Published products (`?category=&room=&style=&featured=`) |
| GET | `/public/products/:slug` | One published product |
| GET | `/public/rooms` · `/public/styles` | Active taxonomies |
| GET | `/public/hero` | Active hero slides (`?placement=`) |
| GET | `/public/testimonials` · `/public/faqs` | Active content |
| GET | `/public/projects` · `/public/projects/:slug` | Published portfolio |
| GET | `/public/settings` | Site config as a key→value map |
| POST | `/public/leads` | **Lead intake** (contact/quote form) |

### Auth

| POST | `/auth/login` | Returns `{ token, user }` |
| GET | `/auth/me` | Current user (requires token) |

### Admin / CRM (auth + permission-guarded)

Standard REST (`GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`):

`/users` `/roles` `/categories` `/products` `/rooms` `/styles`
`/hero-slides` `/testimonials` `/projects` `/faqs` `/settings`
`/leads` `/quotes`

Plus:

- `GET /dashboard/stats` — aggregate counts + recent leads
- `POST /leads/:id/activities` — add a timeline entry
- `PATCH /leads/:id` — status changes auto-log an activity
- `GET /roles/permissions` — permission catalog for the UI
- `POST /quotes` — line-item totals (subtotal/discount/tax/total) computed server-side

List endpoints support `?page=&pageSize=&q=&sort=field:dir` and resource-specific
filters (e.g. `?status=PUBLISHED`).
