# Odyssey Fullstack Assignment

pnpm workspace + Turborepo monorepo for the restaurant operations dashboard.

**Repository:** https://github.com/AdityaMogare/Ody-

**Submission package** (local run, seed, architecture, tradeoffs): [SUBMISSION.md](SUBMISSION.md)

## Structure

```text
apps/dashboard          Expo (React Native + Web)
services/backend        Hono on Cloudflare Workers
packages/shared         Shared utilities
packages/types          Shared domain types (non-generated)
packages/api-client     Orval-generated React Query client
```

## Prerequisites

- Node.js 20+
- pnpm 9+

## Development scripts

Run these from the repository root (no `cd` into packages required).

| Command | Description |
| --- | --- |
| `pnpm dev:dashboard` | Start the Expo web dashboard (`expo start --web` in `apps/dashboard`). |
| `pnpm dev:backend` | Start the Hono API locally with Wrangler (`wrangler dev` in `services/backend`). |
| `pnpm gen:contract` | Export `openapi.json` from the backend and regenerate `@ody/api-client` with Orval. |
| `pnpm lint` | Run ESLint in every workspace package. |
| `pnpm typecheck` | Type-check all packages in dependency order (after upstream builds and contract generation). |
| `pnpm test` | Run Vitest in `services/backend` and `apps/dashboard` (fails if either suite fails). |
| `pnpm build` | Build all packages via Turborepo. |
| `pnpm db:migrate` | Apply Drizzle migrations to the configured Postgres database. |
| `pnpm db:seed` | Seed the database with sample restaurant data. |

## Quick start

```bash
pnpm install
cp services/backend/.dev.vars.example services/backend/.dev.vars
cp services/backend/.env.example services/backend/.env

pnpm gen:contract
pnpm db:migrate
pnpm db:seed

pnpm dev:backend    # http://127.0.0.1:8787/health
pnpm dev:dashboard  # http://localhost:8081
```

See [SUBMISSION.md](SUBMISSION.md) for Docker Postgres setup, seed details, and architecture notes.

## Dashboard routes

| Route | Description |
| --- | --- |
| `/` | Home — KPIs, recent orders, top items |
| `/orders` | Order queue and detail drawer |
| `/menu` | Menu management (categories + items) |
| `/crm` | Customers, spend, order history |
| `/settings` | Restaurant settings |
| `/ui-library` | Design system showcase |

## Session progress

Full build log: [docs/SESSION_LOG.md](docs/SESSION_LOG.md)

## TypeScript project references

Root `tsconfig.json` references each package. Library packages (`@ody/types`, `@ody/shared`) build to `dist/` via `tsc -b`. The dashboard consumes workspace packages through Metro + TS path aliases.

`@ody/api-client` intentionally has no source until `pnpm gen:contract` runs Orval.

## Database (Phase 2)

Schema lives in `services/backend/src/db/schema.ts` (source of truth).  
`drizzle-zod` insert/select schemas are generated in `services/backend/src/db/zod.ts` and re-exported from `@ody/types`.

```bash
# Start Postgres locally (example)
docker run --name ody-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ody -p 5432:5432 -d postgres:16

cp services/backend/.env.example services/backend/.env
pnpm --filter @ody/backend db:generate
pnpm --filter @ody/backend db:migrate
```

Prices are stored as **integer cents**. Order status uses a PostgreSQL enum (`order_status`).

## API (Phase 3)

Hono routes with `@hono/zod-openapi`. Order status changes only via `POST /orders/:id/actions` (explicit state machine, not `req.body.status`).

```bash
cp services/backend/.dev.vars.example services/backend/.dev.vars
pnpm --filter @ody/backend db:migrate
pnpm --filter @ody/backend db:seed
pnpm dev:backend

curl http://127.0.0.1:8787/openapi.json
curl http://127.0.0.1:8787/health
```

## API client (Phase 4)

Orval generates React Query hooks into `@ody/api-client` from the OpenAPI spec.

```bash
pnpm gen:contract   # exports openapi.json + runs Orval
```

**Never hand-edit `packages/api-client/src/generated/`** — fix the backend OpenAPI spec and regenerate.

Live regeneration (backend must be running):

```bash
pnpm dev:backend
pnpm --filter @ody/api-client gen:contract:live
```
