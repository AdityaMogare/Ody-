import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";

import type { AppEnv } from "../env";
import type { OpeningHours } from "../db/schema";
import { restaurantSettings } from "../db/schema";
import { notFound } from "../lib/errors";
import {
  ErrorSchema,
  SettingsSchema,
  UpdateSettingsBodySchema,
} from "../openapi/schemas";

export const settingsRoutes = new OpenAPIHono<AppEnv>();

const getSettingsRoute = createRoute({
  method: "get",
  path: "/settings",
  tags: ["Settings"],
  responses: {
    200: {
      description: "Restaurant settings",
      content: { "application/json": { schema: SettingsSchema } },
    },
    404: {
      description: "Settings not seeded",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

settingsRoutes.openapi(getSettingsRoute, async (c) => {
  const db = c.get("db");
  const settings = await db.query.restaurantSettings.findFirst();
  if (!settings) {
    notFound("Restaurant settings not found. Run the seed script.");
  }
  return c.json(settings, 200);
});

const patchSettingsRoute = createRoute({
  method: "patch",
  path: "/settings",
  tags: ["Settings"],
  request: {
    body: {
      content: { "application/json": { schema: UpdateSettingsBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Settings updated",
      content: { "application/json": { schema: SettingsSchema } },
    },
    404: {
      description: "Settings not seeded",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

settingsRoutes.openapi(patchSettingsRoute, async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const existing = await db.query.restaurantSettings.findFirst();
  if (!existing) {
    notFound("Restaurant settings not found. Run the seed script.");
  }

  const [updated] = await db
    .update(restaurantSettings)
    .set({
      restaurantName: body.restaurantName ?? existing.restaurantName,
      prepTimeMinutes: body.prepTimeMinutes ?? existing.prepTimeMinutes,
      autoAcceptOrders: body.autoAcceptOrders ?? existing.autoAcceptOrders,
      serviceAvailable: body.serviceAvailable ?? existing.serviceAvailable,
      openingHours: (body.openingHours ?? existing.openingHours) as OpeningHours,
      updatedAt: new Date(),
    })
    .where(eq(restaurantSettings.id, existing.id))
    .returning();

  return c.json(updated, 200);
});
