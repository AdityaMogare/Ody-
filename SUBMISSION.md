# Odyssey Fullstack Assignment — Submission

## GitHub repository

**https://github.com/AdityaMogare/Ody-**

Clone:

```bash
git clone https://github.com/AdityaMogare/Ody-.git
cd Ody-
pnpm install
```

---

## Run locally

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16 (local install or Docker)

### 1. Database

```bash
# Option A: Docker
docker run --name ody-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ody \
  -p 5432:5432 -d postgres:16

# Option B: local Postgres — create database `ody`
createdb ody
```

Copy backend env files and set `DATABASE_URL`:

```bash
cp services/backend/.dev.vars.example services/backend/.dev.vars
cp services/backend/.env.example services/backend/.env
```

Both files expect:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ody
```

Apply migrations and seed (from repo root):

```bash
pnpm db:migrate
pnpm db:seed
```

### 2. Generate API client (first run)

Orval hooks are generated from the backend OpenAPI spec — not checked into source as hand-written code.

```bash
pnpm gen:contract
```

### 3. Start services

Use two terminals:

```bash
pnpm dev:backend    # Hono API via Wrangler → http://127.0.0.1:8787
pnpm dev:dashboard  # Expo web → http://localhost:8081
```

Verify:

- API health: `curl http://127.0.0.1:8787/health`
- OpenAPI: `curl http://127.0.0.1:8787/openapi.json`
- Dashboard: open `http://localhost:8081`

Optional: point the dashboard at a different API host with `EXPO_PUBLIC_API_URL` in `apps/dashboard/.env`.

### 4. Quality checks (optional)

```bash
pnpm typecheck
pnpm lint
pnpm test
```

---

## Seed data

Run from the repository root:

```bash
pnpm db:seed
```

This executes `services/backend/scripts/seed.ts`. It **clears and repopulates** demo data.

| Entity | Count | Notes |
| --- | --- | --- |
| Menu categories | 3 | Starters, Mains, Drinks |
| Menu items | 7 | One item (`Seasonal Pasta`) is intentionally unavailable |
| Customers | 10 | Named Alice–James with example emails/phones |
| Orders | ~30 | Mix of all statuses; ~60% created “today” for Home KPIs |
| Restaurant settings | 1 | Default opening hours + 8% tax rate |

Order timestamps are relative to seed time (`minutesAgo` / `daysAgo`), so Home KPIs and “recent orders” stay realistic on every re-seed.

After seeding, the script logs counts by status and sample IDs for a pending order and first customer.

Re-seed anytime:

```bash
pnpm db:seed
```

---

## Architecture decisions

### Monorepo layout

```text
apps/dashboard          Expo (React Native + Web) — operator dashboard
services/backend        Hono on Cloudflare Workers (local dev via Wrangler)
packages/api-client     Orval-generated React Query hooks
packages/types          Shared types (drizzle-zod re-exports)
packages/shared         Shared utilities
```

pnpm workspaces + Turborepo orchestrate builds, lint, typecheck, and tests across packages.

### Contract-first API pipeline

The database schema is the source of truth. Types and API contracts flow from it — no hand-written DTOs on the frontend.

```text
Drizzle schema → drizzle-zod → Hono OpenAPI routes → Orval → @ody/api-client → dashboard
```

Frontend code uses generated hooks from `@ody/api-client`, not ad-hoc `fetch` calls.

### Backend

- **Hono + `@hono/zod-openapi`** for typed routes and a live OpenAPI document.
- **Drizzle ORM** against PostgreSQL; prices stored as **integer cents**.
- **Order status** is a PostgreSQL enum updated only through `POST /orders/:id/actions` (explicit state machine, not free-form PATCH).
- Server validates totals and rejects orders containing unavailable menu items.

### Dashboard

- **Expo Router** with a web-first shell: collapsible sidebar, KPI home, orders/CRM drawers.
- **Design system** in `apps/dashboard/src/design-system/` with `tokens.ts` as the styling source of truth.
- **React Query** via generated hooks; a custom mutator in `packages/api-client/src/mutator.ts` wraps responses as `{ data, status, headers }` so hooks can read `query.data.data` consistently.
- **Shared drawers**: `OrderDetailDrawer` and `CustomerDetailDrawer` are reused across Orders and CRM.

### Key conventions

| Topic | Choice |
| --- | --- |
| Money | Cents in DB/API; dollars only in UI inputs |
| Order lifecycle | Action-based transitions (`accept`, `start_preparing`, etc.) |
| API types | Generated only; fix backend OpenAPI, then `pnpm gen:contract` |
| Styling | React Native `StyleSheet` + design tokens (no scattered hex colors) |

---

The Drizzle schema in `services/backend/src/db/schema.ts` is the only place 
types are defined. drizzle-zod derives Zod validation schemas automatically. 
Hono routes annotated with `@hono/zod-openapi` produce a live OpenAPI spec. 
Orval reads that spec and generates typed React Query hooks. The frontend 
has zero hand-written API types.

### Money as integer cents
All prices and totals are stored and transmitted as integer cents. The 
frontend converts to dollars only for display. This eliminates floating 
point errors entirely.

### Order status as a state machine
Order status transitions happen exclusively via `POST /orders/:id/actions` 
with an explicit action name — not via a free-form PATCH on the status field. 
The backend enforces valid transitions and rejects invalid ones with a 422. 
The frontend derives which action buttons to show from the current status, 
so invalid transitions are never presented to the user.

### Generated API client
Using Orval over a manually maintained client means the frontend types 
always match the backend exactly. Running `pnpm gen:contract` after any 
backend change keeps the entire contract in sync in one command.

### Expo React Native Web
The dashboard targets web via React Native Web, meaning the same component 
tree could run on iOS and Android with minimal changes. For this assignment 
the web target is the priority; native is structurally supported but not 
tested.

### Cloudflare Workers
Hono runs on Cloudflare Workers via Wrangler. The Workers runtime has no 
Node.js built-ins, which influenced a few small choices (no `path` module, 
fetch-based HTTP client in Orval).

---

## Tradeoffs and incomplete areas

### No authentication
The dashboard has no login or session management. In production this would 
be the first thing to add — every route should require authentication and 
the API should scope data to the authenticated restaurant.

### Client-side aggregation on Home
The Home KPIs (revenue today, pending count, top items) are computed 
client-side by fetching all orders and filtering in the hook. This works 
fine for small datasets but would not scale. In production these would be 
dedicated aggregation endpoints with server-side SQL.

### No pagination
The orders and customer lists fetch all records. Pagination or infinite 
scroll would be needed for real-world volumes.

### Test coverage
Backend tests cover the critical order flow paths. Frontend tests cover 
key components and the order action utility. Full coverage across all 
routes and components was descoped to stay within the timebox.

### Native readiness
The component structure is React Native compatible but the dashboard has 
only been tested on web. Some layout choices (fixed sidebar width, web-only 
CSS transitions on the collapsible sidebar) would need revisiting for a 
native build.

### No production deploy
The backend is configured for local Wrangler dev. A production deploy would 
require a Cloudflare Workers account, a managed PostgreSQL instance 
(Neon or Supabase), and environment variable configuration in the Cloudflare 
dashboard.

---

## Repo structure

```text
apps/
  dashboard/          # Expo React Native Web frontend
    app/              # expo-router file-based routes
    src/
      design-system/  # tokens, theme, primitive components
      screens/        # page components
      hooks/          # data hooks
      components/     # shared UI components
      navigation/     # sidebar, nav items, routing config

services/
  backend/            # Hono on Cloudflare Workers
    src/
      db/             # Drizzle schema, migrations, zod schemas
      routes/         # API route handlers
    scripts/          # seed script

packages/
  api-client/         # Orval-generated hooks (do not edit generated/)
  types/              # Re-exported drizzle-zod schemas
  shared/             # Shared utilities
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — KPIs, recent orders, top menu items |
| `/orders` | Orders — list, filters, detail drawer, status actions |
| `/menu` | Menu — categories, items, CRUD modals |
| `/crm` | CRM — customer list, spend, order history |
| `/settings` | Settings — prep time, service availability, hours |
| `/ui-library` | Design system showcase — tokens, components, states |
## Tradeoffs and incomplete areas

### No authentication
The dashboard has no login or session management. In production this would 
be the first thing to add — every route should require authentication and 
the API should scope data to the authenticated restaurant.

### Client-side aggregation on Home
The Home KPIs (revenue today, pending count, top items) are computed 
client-side by fetching all orders and filtering in the hook. This works 
fine for small datasets but would not scale. In production these would be 
dedicated aggregation endpoints with server-side SQL.

### No pagination
The orders and customer lists fetch all records. Pagination or infinite 
scroll would be needed for real-world volumes.

### Test coverage
Backend tests cover the critical order flow paths. Frontend tests cover 
key components and the order action utility. Full coverage across all 
routes and components was descoped to stay within the timebox.

### Native readiness
The component structure is React Native compatible but the dashboard has 
only been tested on web. Some layout choices (fixed sidebar width, web-only 
CSS transitions on the collapsible sidebar) would need revisiting for a 
native build.

### No production deploy
The backend is configured for local Wrangler dev. A production deploy would 
require a Cloudflare Workers account, a managed PostgreSQL instance 
(Neon or Supabase), and environment variable configuration in the Cloudflare 
dashboard.

---

## Dashboard routes

| Route | Screen |
| --- | --- |
| `/` | Home — KPIs, recent orders, top menu items chart |
| `/orders` | Order queue, filters, order detail drawer |
| `/menu` | Categories, items, availability toggles |
| `/crm` | Customers, spend, order history, shared drawers |
| `/settings` | Restaurant settings |
| `/ui-library` | Design system showcase |
