# Odyssey Fullstack Assignment

Restaurant operations dashboard — pnpm workspace + Turborepo monorepo.

**Repository:** https://github.com/AdityaMogare/Ody-

## Documentation

| Doc | Purpose |
| --- | --- |
| [SUBMISSION.md](SUBMISSION.md) | Full setup, seed data, architecture decisions, tradeoffs |
| [AGENTS.md](AGENTS.md) | Contract pipeline and `@ody/api-client` rules |
| [docs/SESSION_LOG.md](docs/SESSION_LOG.md) | Build session notes |

## Structure

```text
apps/dashboard          Expo (React Native + Web)
services/backend        Hono on Cloudflare Workers
packages/api-client     Orval-generated React Query client
packages/types          Shared types (drizzle-zod re-exports)
packages/shared         Shared utilities
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16

## Quick start

```bash
pnpm install
cp services/backend/.dev.vars.example services/backend/.dev.vars
cp services/backend/.env.example services/backend/.env

pnpm gen:contract
pnpm db:migrate
pnpm db:seed

pnpm dev:backend    # http://127.0.0.1:8787
pnpm dev:dashboard  # http://localhost:8081
```

Postgres via Docker, seed contents, and verification steps: [SUBMISSION.md](SUBMISSION.md).

## Scripts

Run from the repository root.

| Command | Description |
| --- | --- |
| `pnpm dev:backend` | Hono API via Wrangler (`services/backend`) |
| `pnpm dev:dashboard` | Expo web dashboard (`apps/dashboard`) |
| `pnpm gen:contract` | Export OpenAPI spec and regenerate `@ody/api-client` |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:seed` | Seed demo restaurant data |
| `pnpm build` | Build all packages (Turborepo) |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | ESLint across workspaces |
| `pnpm test` | Vitest in backend and dashboard |

## Dashboard routes

| Route | Description |
| --- | --- |
| `/` | Home — KPIs, recent orders, top items |
| `/orders` | Order queue, filters, detail drawer |
| `/menu` | Menu management |
| `/crm` | Customers, spend, order history |
| `/settings` | Restaurant settings |
| `/ui-library` | Design system showcase |

## Architecture (summary)

```text
Drizzle schema → drizzle-zod → Hono OpenAPI → Orval → @ody/api-client → dashboard
```

- **Schema:** `services/backend/src/db/schema.ts` (source of truth)
- **API:** Hono + `@hono/zod-openapi`; order status via `POST /orders/:id/actions` only
- **Frontend:** Generated React Query hooks — never hand-edit `packages/api-client/src/generated/`

After backend API changes:

```bash
pnpm gen:contract
```

Live regeneration (backend must be running):

```bash
pnpm dev:backend
pnpm --filter @ody/api-client gen:contract:live
```

Details: [SUBMISSION.md](SUBMISSION.md) · Agent rules: [AGENTS.md](AGENTS.md)

## TypeScript

Root `tsconfig.json` references each package. `@ody/types` and `@ody/shared` build to `dist/` via `tsc -b`. The dashboard resolves workspace packages through Metro + TS path aliases.

`@ody/api-client` is generated output — run `pnpm gen:contract` before typecheck if hooks are missing.
