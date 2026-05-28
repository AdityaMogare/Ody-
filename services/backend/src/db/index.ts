import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { schema } from "./schema";

export type Database = ReturnType<typeof createDb>;

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { max: 1 });
  return drizzle(client, { schema });
}

export * from "./constants";
export * from "./schema";
export * from "./zod";
