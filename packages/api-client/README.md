# @ody/api-client

Orval-generated React Query hooks and TypeScript types from the backend OpenAPI spec.

## Generate

**Default (recommended)** — export spec from backend, then generate offline:

```bash
pnpm gen:contract
```

**Live server** — backend running on port 8787:

```bash
pnpm dev:backend
pnpm --filter @ody/api-client gen:contract:live
```

`orval.config.ts` defaults to `http://localhost:8787/openapi.json`.

## DO NOT edit generated code

Everything under `src/generated/` is produced by Orval.

- If a type or hook is wrong → fix the Hono/OpenAPI route or schema in `services/backend`, then regenerate.
- Never patch `src/generated/**` by hand.

Safe to edit: `src/mutator.ts`, `src/index.ts`, `orval.config.ts`.
