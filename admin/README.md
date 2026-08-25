# Kalope Homes — Admin Console

React 19 + Vite + TypeScript admin dashboard for managing everything the public
**web** app displays (products, categories, hero banners, testimonials,
projects, FAQs, site settings) plus the **CRM** pipeline (leads → quotes) and
**users/roles**. Styled with Tailwind CSS v4 + shadcn-style components.

## Getting started

```bash
cp .env.example .env          # VITE_API_URL=http://localhost:4000
npm install
npm run dev                   # http://localhost:5174
```

The API (`../api`) must be running and seeded. Sign in with the seeded super
admin: `admin@kalopehomes.com` / `Admin@12345`.

## Architecture

- **`src/lib/api.ts`** — fetch client (JWT header, error envelope, pagination types).
- **`src/auth/`** — `AuthProvider` + `useAuth` (session, `can(permission)`), `ProtectedRoute`.
- **`src/layout/`** — sidebar + topbar; nav items are hidden when the user lacks the permission.
- **`src/resources/`** — a **config-driven CRUD engine**. `registry.tsx` declares
  each entity's columns, form fields and permissions; `ResourceListPage` +
  `ResourceForm` render list/create/edit/delete for all of them. Add a new
  managed entity by adding one entry to the registry + a route.
- **`src/pages/`** — custom pages that don't fit generic CRUD: Dashboard, Leads
  (list + detail with pipeline/timeline/quote builder), Quotes, Roles, Settings.

## Permissions

The UI mirrors the API's RBAC: nav, "New/Edit/Delete" buttons and pipeline
controls appear only when `can('<permission>')` is true, so a `sales-agent`
sees Leads/Quotes while a `content-editor` sees the catalog & CMS.
