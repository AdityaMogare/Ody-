import path from "node:path";
import { fileURLToPath } from "node:url";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { schema } from "../../db/schema";
import { DEFAULT_OPENING_HOURS } from "../../db/constants";
import {
  customers,
  menuCategories,
  menuItems,
  restaurantSettings,
} from "../../db/schema";
import { getTestDatabaseUrl } from "./test-env";

const migrationsFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../drizzle",
);

let sharedClient: ReturnType<typeof postgres> | null = null;
let sharedDb: Database | null = null;

type Database = ReturnType<typeof drizzle<typeof schema>>;

export function getTestDb(): Database {
  if (!sharedDb) {
    throw new Error("Test database not initialized. Run ensureTestDatabase() first.");
  }
  return sharedDb;
}

export async function ensureTestDatabase(): Promise<void> {
  const url = getTestDatabaseUrl();
  sharedClient = postgres(url, { max: 1 });

  await sharedClient.unsafe(`
    DROP SCHEMA IF EXISTS drizzle CASCADE;
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `);

  const migrationDb = drizzle(sharedClient);
  await migrate(migrationDb, { migrationsFolder });
  sharedDb = drizzle(sharedClient, { schema });
}

export async function closeTestDatabase(): Promise<void> {
  if (sharedClient) {
    await sharedClient.end({ timeout: 5 });
    sharedClient = null;
    sharedDb = null;
  }
}

export async function resetDatabase(db: Database): Promise<void> {
  await db.execute(sql`
    TRUNCATE TABLE
      order_items,
      orders,
      menu_items,
      menu_categories,
      customers,
      restaurant_settings
    RESTART IDENTITY CASCADE
  `);
}

export type OrderTestFixtures = {
  categoryId: string;
  availableItem: { id: string; name: string; priceCents: number };
  unavailableItem: { id: string; name: string; priceCents: number };
  customerId: string;
};

export async function seedOrderFixtures(db: Database): Promise<OrderTestFixtures> {
  await db.insert(restaurantSettings).values({
    restaurantName: "Test Kitchen",
    prepTimeMinutes: 15,
    autoAcceptOrders: false,
    serviceAvailable: true,
    openingHours: DEFAULT_OPENING_HOURS,
  });

  const [category] = await db
    .insert(menuCategories)
    .values({ name: "Test Category", sortOrder: 1 })
    .returning();

  const [available, unavailable] = await db
    .insert(menuItems)
    .values([
      {
        categoryId: category.id,
        name: "Available Item",
        priceCents: 1000,
        available: true,
      },
      {
        categoryId: category.id,
        name: "Unavailable Item",
        priceCents: 500,
        available: false,
      },
    ])
    .returning();

  const [customer] = await db
    .insert(customers)
    .values({
      name: "Test Customer",
      email: "test@example.com",
      phone: null,
    })
    .returning();

  return {
    categoryId: category.id,
    availableItem: {
      id: available.id,
      name: available.name,
      priceCents: available.priceCents,
    },
    unavailableItem: {
      id: unavailable.id,
      name: unavailable.name,
      priceCents: unavailable.priceCents,
    },
    customerId: customer.id,
  };
}
