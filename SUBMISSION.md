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

Apply migrations (from repo root):

```bash
pnpm db:migrate
pnpm db:seed
```

### 2. Generate API client (first run)

Orval hooks are generated from the backend OpenAPI spec — not checked in as hand-written code.

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

`pnpm db:seed` runs `services/backend/scripts/seed.ts`. It **clears and repopulates** demo data. Re-run anytime to refresh.

| Entity | Count | Notes |
| --- | --- | --- |
| Menu categories | 3 | Starters, Mains, Drinks |
| Menu items | 7 | One item (`Seasonal Pasta`) is intentionally unavailable |
| Customers | 10 | Named Alice–James with example emails/phones |
| Orders | ~30 | Mix of all statuses; ~60% created “today” for Home KPIs |
| Restaurant settings | 1 | Default opening hours + 8% tax rate |

Order timestamps are relative to seed time (`minutesAgo` / `daysAgo`), so Home KPIs and “recent orders” stay realistic on every re-seed. The script logs counts by status and sample IDs for a pending order and first customer.

---

## Architecture decisions

### Monorepo layout

```text
apps/
  dashboard/          # Expo React Native Web — operator dashboard
    app/              # expo-router file-based routes
    src/
      design-system/  # tokens, theme, primitive components
      screens/        # page components
      hooks/          # data hooks
      components/     # shared UI (OrderDetailDrawer, etc.)
      navigation/     # sidebar, shell, routing config

services/
  backend/            # Hono on Cloudflare Workers (local dev via Wrangler)
    src/db/           # Drizzle schema, migrations, zod schemas
    src/routes/       # API route handlers
    scripts/          # seed script

packages/
  api-client/         # Orval-generated React Query hooks (do not edit generated/)
  types/              # Re-exported drizzle-zod schemas
  shared/             # Shared utilities
```

pnpm workspaces + Turborepo orchestrate builds, lint, typecheck, and tests across packages.

### Contract-first API pipeline

The Drizzle schema in `services/backend/src/db/schema.ts` is the only place types are defined. Types and API contracts flow from it — no hand-written DTOs on the frontend.

```text
Drizzle schema → drizzle-zod → Hono OpenAPI routes → Orval → @ody/api-client → dashboard
```

- **drizzle-zod** derives Zod validation schemas automatically.
- **Hono + `@hono/zod-openapi`** produces a live OpenAPI document.
- **Orval** generates typed React Query hooks; the frontend uses `@ody/api-client`, not ad-hoc `fetch`.
- After any backend change, run `pnpm gen:contract` to keep the contract in sync.

### Backend

- **Drizzle ORM** against PostgreSQL; prices stored as **integer cents** (dollars only in UI inputs — eliminates floating-point errors).
- **Order status** is a PostgreSQL enum updated only through `POST /orders/:id/actions` (explicit state machine, not free-form PATCH). Invalid transitions return 422.
- Server validates totals and rejects orders containing unavailable menu items.
- **Cloudflare Workers** via Wrangler: no Node.js built-ins in the runtime, which influenced fetch-based HTTP and avoiding Node-only modules.

### Dashboard

- **Expo Router** with a web-first shell: collapsible sidebar, KPI home, orders/CRM drawers. Same component tree could run on native; web is the tested target for this assignment.
- **Design system** in `apps/dashboard/src/design-system/` with `tokens.ts` as the styling source of truth.
- **React Query** via generated hooks; `packages/api-client/src/mutator.ts` wraps responses as `{ data, status, headers }` so hooks read `query.data.data` consistently.
- **Shared drawers**: `OrderDetailDrawer` and `CustomerDetailDrawer` reused across Orders and CRM.

### Key conventions

| Topic | Choice |
| --- | --- |
| Money | Cents in DB/API; dollars only in UI inputs |
| Order lifecycle | Action-based transitions (`accept`, `start_preparing`, etc.) |
| API types | Generated only; fix backend OpenAPI, then `pnpm gen:contract` |
| Styling | React Native `StyleSheet` + design tokens (no scattered hex colors) |

---

## Dashboard routes

| Route | Description |
| --- | --- |
| `/` | Home — KPIs, recent orders, top menu items chart |
| `/orders` | Order queue, filters, detail drawer, status actions |
| `/menu` | Categories, items, availability toggles, CRUD modals |
| `/crm` | Customers, spend, order history, shared drawers |
| `/settings` | Restaurant settings — prep time, service availability, hours |
| `/ui-library` | Design system showcase — tokens, components, states |

---

## Tradeoffs and incomplete areas

**No authentication.** The dashboard has no login or session management. Production would require auth on every route and API scoping to the authenticated restaurant.

**Client-side aggregation on Home.** KPIs (revenue today, pending count, top items) are computed client-side by fetching all orders. Fine for demo data; production would use dedicated aggregation endpoints.

**No pagination.** Orders and customer lists fetch all records. Pagination or infinite scroll would be needed at scale.

**Test coverage.** Backend tests cover critical order flows; frontend tests cover key components and order actions. No E2E tests; some dashboard suites hit Expo icon resolution issues in plain Node.

**Web-first / native readiness.** Collapsible sidebar and drawer UX target Expo Web. Component structure is RN-compatible, but layout choices (sidebar width, web-only transitions) would need revisiting for native.

**Drawer stacking.** Orders and CRM can open customer and order drawers simultaneously; there is no unified drawer stack manager. Successful status actions close the order drawer by design.

**Seed is dev-only.** Fixed tax rate, no multi-tenant isolation, not production-grade.

**No production deploy.** Backend is configured for local Wrangler dev. Production would need Cloudflare Workers secrets, managed Postgres (Neon/Supabase), and Expo web hosting.
