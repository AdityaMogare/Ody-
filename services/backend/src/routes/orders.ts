import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";

import type { AppEnv } from "../env";
import { orders } from "../db/schema";
import { badRequest, notFound } from "../lib/errors";
import {
  CreateOrderBodySchema,
  ErrorSchema,
  IdParamSchema,
  OrderActionBodySchema,
  OrderActionResultSchema,
  OrderListQuerySchema,
  OrderWithItemsSchema,
  UpdateOrderBodySchema,
} from "../openapi/schemas";
import { validateAndPriceOrderLines } from "../services/order-create";
import {
  allowedActions,
  getNextStatus,
  type OrderAction,
} from "../services/order-state-machine";
import {
  getOrderWithItems,
  insertOrderItems,
  listOrdersWithItems,
} from "../services/orders";

export const orderRoutes = new OpenAPIHono<AppEnv>();

const listOrdersRoute = createRoute({
  method: "get",
  path: "/orders",
  tags: ["Orders"],
  request: { query: OrderListQuerySchema },
  responses: {
    200: {
      description: "List orders with line items",
      content: {
        "application/json": { schema: z.array(OrderWithItemsSchema) },
      },
    },
  },
});

orderRoutes.openapi(listOrdersRoute, async (c) => {
  const db = c.get("db");
  const query = c.req.valid("query");
  const rows = await listOrdersWithItems(db, {
    status: query.status,
    customerId: query.customerId,
    limit: query.limit,
    offset: query.offset,
  });
  return c.json(rows, 200);
});

const createOrderRoute = createRoute({
  method: "post",
  path: "/orders",
  tags: ["Orders"],
  request: {
    body: {
      content: { "application/json": { schema: CreateOrderBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Order created",
      content: { "application/json": { schema: OrderWithItemsSchema } },
    },
    400: {
      description: "Invalid order payload",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

orderRoutes.openapi(createOrderRoute, async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");

  if (body.customerId) {
    const customer = await db.query.customers.findFirst({
      where: (table, { eq: eqFn }) => eqFn(table.id, body.customerId!),
    });
    if (!customer) {
      notFound("Customer not found");
    }
  }

  const priced = await validateAndPriceOrderLines(db, {
    items: body.items,
    subtotalCents: body.subtotalCents,
    taxCents: body.taxCents ?? 0,
    totalCents: body.totalCents,
  });

  const settings = await db.query.restaurantSettings.findFirst();
  let status: (typeof orders.$inferSelect)["status"] = "pending";
  if (settings?.autoAcceptOrders) {
    status = "accepted";
  }

  const [order] = await db
    .insert(orders)
    .values({
      customerId: body.customerId ?? null,
      status,
      subtotalCents: priced.subtotalCents,
      taxCents: priced.taxCents,
      totalCents: priced.totalCents,
      notes: body.notes ?? null,
    })
    .returning();

  await insertOrderItems(db, order.id, priced.lines);
  const full = await getOrderWithItems(db, order.id);
  return c.json(full, 201);
});

const getOrderRoute = createRoute({
  method: "get",
  path: "/orders/{id}",
  tags: ["Orders"],
  request: { params: IdParamSchema },
  responses: {
    200: {
      description: "Order detail",
      content: { "application/json": { schema: OrderWithItemsSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

orderRoutes.openapi(getOrderRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const order = await getOrderWithItems(db, id);
  return c.json(order, 200);
});

const patchOrderRoute = createRoute({
  method: "patch",
  path: "/orders/{id}",
  tags: ["Orders"],
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateOrderBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Order updated (notes only — status via actions)",
      content: { "application/json": { schema: OrderWithItemsSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

orderRoutes.openapi(patchOrderRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [updated] = await db
    .update(orders)
    .set({
      notes: body.notes ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();

  if (!updated) {
    notFound("Order not found");
  }

  const full = await getOrderWithItems(db, id);
  return c.json(full, 200);
});

const orderActionRoute = createRoute({
  method: "post",
  path: "/orders/{id}/actions",
  tags: ["Orders"],
  request: {
    params: IdParamSchema,
    body: {
      content: { "application/json": { schema: OrderActionBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Order status transitioned",
      content: { "application/json": { schema: OrderActionResultSchema } },
    },
    400: {
      description: "Invalid transition",
      content: { "application/json": { schema: ErrorSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

orderRoutes.openapi(orderActionRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const { action } = c.req.valid("json");

  const existing = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });
  if (!existing) {
    notFound("Order not found");
  }

  const previousStatus = existing.status;
  const nextStatus = getNextStatus(previousStatus, action as OrderAction);
  if (!nextStatus) {
    badRequest(
      `Action "${action}" is not allowed from status "${previousStatus}"`,
      { allowedActions: allowedActions(previousStatus) },
    );
  }

  await db
    .update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(orders.id, id));

  const order = await getOrderWithItems(db, id);
  return c.json(
    {
      order,
      previousStatus,
      action,
      allowedActions: allowedActions(nextStatus),
    },
    200,
  );
});
