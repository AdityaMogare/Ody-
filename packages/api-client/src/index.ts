/**
 * Orval-generated API client. Import hooks and types from here.
 *
 * DO NOT hand-edit anything under `src/generated/`.
 * If types or hooks are wrong, fix the OpenAPI spec and run `pnpm gen:contract`.
 */
export { getApiBaseUrl, customFetch } from "./mutator";
export type { ErrorType } from "./mutator";

export * from "./generated/models";
export * from "./generated/endpoints/menu/menu";
export * from "./generated/endpoints/customers/customers";
export * from "./generated/endpoints/orders/orders";
export * from "./generated/endpoints/settings/settings";
