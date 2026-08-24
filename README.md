# Kalope Homes

Monorepo containing four TypeScript applications.

| App          | Stack                      | Description            |
| ------------ | -------------------------- | ---------------------- |
| `web`        | Next.js + TypeScript       | Public frontend app    |
| `admin`      | React (Vite) + TypeScript  | Admin dashboard        |
| `quotation`  | React (Vite) + TypeScript  | Quotation app          |
| `api`        | Node.js + Express + TS     | Backend API            |

## Getting started

Each app is self-contained. Install and run individually:

```bash
# Frontend (Next.js)
cd web && npm install && npm run dev

# Admin (Vite)
cd admin && npm install && npm run dev

# Quotation (Vite)
cd quotation && npm install && npm run dev

# API (Express)
cd api && npm install && npm run dev
```
