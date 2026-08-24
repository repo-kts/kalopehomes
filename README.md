# Kalope Homes

A single repository holding **five independent, separately-deployable** TypeScript
applications. There is **no monorepo tooling** (no workspaces / Turborepo) by design —
each folder installs, builds, and deploys on its own so they can ship to different
platforms and pipelines.

| App         | Stack                     | Dev port | Description         |
| ----------- | ------------------------- | -------- | ------------------- |
| `web`       | Next.js + TypeScript      | `3000`   | Public frontend app |
| `admin`     | React (Vite) + TypeScript | `5174`   | Admin dashboard     |
| `quotation` | React (Vite) + TypeScript | `5175`   | Quotation app       |
| `crm`       | React (Vite) + TypeScript | `5176`   | CRM app             |
| `api`       | Node.js + Express + TS    | `4000`   | Backend API         |

The distinct dev ports let every app run at the same time locally.

## Getting started

Each app is fully self-contained. Install and run whichever you need:

```bash
cd web       && npm install && npm run dev   # Next.js  → http://localhost:3000
cd admin     && npm install && npm run dev   # Vite     → http://localhost:5174
cd quotation && npm install && npm run dev   # Vite     → http://localhost:5175
cd crm       && npm install && npm run dev   # Vite     → http://localhost:5176
cd api       && npm install && npm run dev   # Express  → http://localhost:4000
```

Copy `.env.example` to `.env` (or `.env.local` for `web`) inside any app before running.

## Conventions (every app)

- **TypeScript** in `strict` mode.
- **Prettier** for formatting — `npm run format` / `npm run format:check`.
- **Linting** — `npm run lint` (ESLint for `web`/`api`, oxlint for the Vite apps).
- **Type checking** — `npm run typecheck`.
- **Node version** pinned via `.nvmrc` (`engines` in each `package.json`).
- **Path alias** `@/…` maps to each app's source root.
- Shared editor defaults in the root `.editorconfig`.

### Common scripts

| Script                 | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server             |
| `npm run build`        | Production build                 |
| `npm run typecheck`    | Type-check without emitting      |
| `npm run lint`         | Lint sources                     |
| `npm run format`       | Format with Prettier             |
| `npm run format:check` | Verify formatting (CI-friendly)  |

## API structure

The `api` app follows a layered layout for maintainability:

```
api/src/
  index.ts              # bootstrap + graceful shutdown
  app.ts                # Express app factory (importable in tests)
  config/env.ts         # validated environment config (fail-fast)
  routes/               # feature routers (health, …)
  middleware/           # async wrapper, 404, centralised error handler
  utils/http-error.ts   # typed operational errors
```

It ships with `helmet` (security headers), `cors`, request logging (`morgan`),
centralised error handling, and graceful shutdown on `SIGTERM`/`SIGINT`.
