import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { z } from "@hono/zod-openapi";

import type { AppEnv } from "../env";
import { menuCategories, menuItems } from "../db/schema";
import { conflict, notFound } from "../lib/errors";
import {
  CreateMenuCategoryBodySchema,
  CreateMenuItemBodySchema,
  ErrorSchema,
  IdParamSchema,
  MenuCategorySchema,
  MenuItemSchema,
  UpdateMenuItemBodySchema,
} from "../openapi/schemas";

export const menuRoutes = new OpenAPIHono<AppEnv>();

const listCategoriesRoute = createRoute({
  method: "get",
  path: "/menu/categories",
  tags: ["Menu"],
  responses: {
    200: {
      description: "List menu categories",
      content: {
        "application/json": {
          schema: z.array(MenuCategorySchema),
        },
      },
    },
  },
});

menuRoutes.openapi(listCategoriesRoute, async (c) => {
  const db = c.get("db");
  const rows = await db.query.menuCategories.findMany({
    orderBy: (table, { asc }) => [asc(table.sortOrder), asc(table.name)],
  });
  return c.json(rows, 200);
});

const createCategoryRoute = createRoute({
  method: "post",
  path: "/menu/categories",
  tags: ["Menu"],
  request: {
    body: {
      content: { "application/json": { schema: CreateMenuCategoryBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Category created",
      content: { "application/json": { schema: MenuCategorySchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

menuRoutes.openapi(createCategoryRoute, async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const [created] = await db.insert(menuCategories).values(body).returning();
  return c.json(created, 201);
});

const listItemsRoute = createRoute({
  method: "get",
  path: "/menu/items",
  tags: ["Menu"],
  responses: {
    200: {
      description: "List menu items",
      content: {
        "application/json": { schema: z.array(MenuItemSchema) },
      },
    },
  },
});

menuRoutes.openapi(listItemsRoute, async (c) => {
  const db = c.get("db");
  const rows = await db.query.menuItems.findMany({
    orderBy: (table, { asc }) => asc(table.name),
  });
  return c.json(rows, 200);
});

const createItemRoute = createRoute({
  method: "post",
  path: "/menu/items",
  tags: ["Menu"],
  request: {
    body: {
      content: { "application/json": { schema: CreateMenuItemBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Menu item created",
      content: { "application/json": { schema: MenuItemSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

menuRoutes.openapi(createItemRoute, async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const category = await db.query.menuCategories.findFirst({
    where: eq(menuCategories.id, body.categoryId),
  });
  if (!category) {
    notFound("Menu category not found");
  }
  const [created] = await db.insert(menuItems).values(body).returning();
  return c.json(created, 201);
});

const patchItemRoute = createRoute({
  method: "patch",
  path: "/menu/items/{id}",
  tags: ["Menu"],
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateMenuItemBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Menu item updated",
      content: { "application/json": { schema: MenuItemSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

menuRoutes.openapi(patchItemRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  if (body.categoryId) {
    const category = await db.query.menuCategories.findFirst({
      where: eq(menuCategories.id, body.categoryId),
    });
    if (!category) {
      notFound("Menu category not found");
    }
  }
  const [updated] = await db
    .update(menuItems)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(menuItems.id, id))
    .returning();
  if (!updated) {
    notFound("Menu item not found");
  }
  return c.json(updated, 200);
});

const deleteItemRoute = createRoute({
  method: "delete",
  path: "/menu/items/{id}",
  tags: ["Menu"],
  request: { params: IdParamSchema },
  responses: {
    200: {
      description: "Menu item deleted",
      content: {
        "application/json": {
          schema: z.object({ deleted: z.literal(true), id: z.string().uuid() }),
        },
      },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
    409: {
      description: "Item referenced by orders",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

menuRoutes.openapi(deleteItemRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  try {
    const [deleted] = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    if (!deleted) {
      notFound("Menu item not found");
    }
    return c.json({ deleted: true as const, id: deleted.id }, 200);
  } catch {
    conflict("Cannot delete menu item that is referenced by existing orders");
  }
});
