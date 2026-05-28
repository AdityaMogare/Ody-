# Development session log

Captured from the Cursor build session for the Odyssey fullstack assignment.

## Completed phases

### Phase 1 — Monorepo scaffold ✅

- pnpm workspace + Turborepo
- `apps/dashboard` (Expo + React Native Web)
- `services/backend` (Hono / Cloudflare Workers)
- `packages/shared`, `packages/types`, `packages/api-client`
- Root scripts: `dev:dashboard`, `dev:backend`, `gen:contract`, `lint`, `typecheck`, `test`
- TypeScript project references; `workspace:*` internal deps

### Phase 2 — Drizzle schema ✅

- `services/backend/src/db/schema.ts` — source of truth
- Tables: `menu_categories`, `menu_items`, `customers`, `orders`, `order_items`, `restaurant_settings`
- `order_status` PostgreSQL enum; prices in **integer cents**
- `drizzle-zod` insert/select schemas in `src/db/zod.ts`
- Re-exported from `@ody/types` (no hand-written DTOs)
- `pnpm --filter @ody/backend db:generate` / `db:migrate` / `db:seed`

### Phase 3 — Hono API + business logic ✅

- OpenAPI routes for menu, customers, orders, settings
- Order status via `POST /orders/:id/actions` only (explicit state machine)
- Server-side total verification; reject unavailable items
- `GET /openapi.json`; seed script at `services/backend/scripts/seed.ts`

### Phase 4 — Orval client ✅

- `packages/api-client/orval.config.ts` — default `http://localhost:8787/openapi.json`; offline via `OPENAPI_FILE=../../openapi.json`
- Generated hooks in `packages/api-client/src/generated/`
- `pnpm gen:contract` = export OpenAPI + Orval
- **Never edit `src/generated/`** — see `AGENTS.md` and `.cursor/rules/api-client.mdc`

### Phase 5 — Design system + Menu page ✅

- `apps/dashboard/src/design-system/` — tokens, ThemeProvider, primitives (Button, Input, Select, Modal, Card, Badge, DataTable, Toast, Skeleton, EmptyState, ErrorBoundary, Toggle)
- `/ui-library` showcase route
- `apps/dashboard/src/screens/MenuScreen.tsx` — category sidebar, item grid, modals, optimistic availability PATCH
- `QueryProvider` + `@ody/api-client` wired in dashboard

## Architecture pipeline

```text
Drizzle schema → drizzle-zod → Hono/OpenAPI → Orval → @ody/api-client → dashboard (React Query)
```

## Key decisions

| Topic | Decision |
| --- | --- |
| Money | Integer cents in DB/API; dollars only in UI inputs |
| Order status | `pgEnum` + action-based transitions, not free-form PATCH |
| API types | Generated only; `@ody/types` re-exports drizzle-zod |
| Styling | StyleSheet + `tokens.ts` (no scattered inline colors) |
| Monorepo | pnpm hoisted; Metro `extraNodeModules` for react + workspace packages |
| Expo web | `output: "single"` for dev (avoids Node SSR react resolution issues) |
| React Native | `0.76.9` in dashboard |

## Run locally

```bash
pnpm install

# Database
docker run --name ody-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ody -p 5432:5432 -d postgres:16
cp services/backend/.dev.vars.example services/backend/.dev.vars
pnpm --filter @ody/backend db:migrate
pnpm --filter @ody/backend db:seed

# API + UI
pnpm dev:backend     # :8787
pnpm dev:dashboard   # :8081 → /menu, /ui-library
```

## Known fixes applied

- **Cannot find module `react`**: Metro `extraNodeModules`, hoist patterns, web `output: "single"`
- **Dashboard TS**: `extends` path to `node_modules/expo/tsconfig.base.json`, `moduleResolution: "bundler"`
- **Port 8787 in use**: kill stale `workerd` before restarting backend

## Remaining assignment work (not done in session)

- Dashboard pages: Home, Settings, CRM, Orders (beyond Menu)
- Home KPIs, CRM spend/history, Orders filters/actions UI
- Targeted frontend tests beyond menu/design system
- Optional: Loom walkthrough, production deploy notes

## File map (high signal)

```text
services/backend/src/db/schema.ts     # DB truth
services/backend/src/routes/          # API routes
services/backend/scripts/seed.ts
packages/api-client/src/generated/    # Orval output (do not edit)
apps/dashboard/src/design-system/
apps/dashboard/src/screens/MenuScreen.tsx
apps/dashboard/app/menu.tsx
openapi.json                          # exported spec for Orval
AGENTS.md                             # agent rules (api-client, pipeline)
```
