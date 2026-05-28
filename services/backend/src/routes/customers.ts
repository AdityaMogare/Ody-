import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";

import type { AppEnv } from "../env";
import { customers, orders } from "../db/schema";
import { notFound } from "../lib/errors";
import {
  CreateCustomerBodySchema,
  CustomerDetailSchema,
  CustomerSchema,
  ErrorSchema,
  IdParamSchema,
} from "../openapi/schemas";

export const customerRoutes = new OpenAPIHono<AppEnv>();

const listCustomersRoute = createRoute({
  method: "get",
  path: "/customers",
  tags: ["Customers"],
  responses: {
    200: {
      description: "List customers",
      content: {
        "application/json": { schema: z.array(CustomerSchema) },
      },
    },
  },
});

customerRoutes.openapi(listCustomersRoute, async (c) => {
  const db = c.get("db");
  const rows = await db.query.customers.findMany({
    orderBy: (table, { asc }) => asc(table.name),
  });
  return c.json(rows, 200);
});

const createCustomerRoute = createRoute({
  method: "post",
  path: "/customers",
  tags: ["Customers"],
  request: {
    body: {
      content: { "application/json": { schema: CreateCustomerBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Customer created",
      content: { "application/json": { schema: CustomerSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

customerRoutes.openapi(createCustomerRoute, async (c) => {
  const db = c.get("db");
  const body = c.req.valid("json");
  const [created] = await db.insert(customers).values(body).returning();
  return c.json(created, 201);
});

const getCustomerRoute = createRoute({
  method: "get",
  path: "/customers/{id}",
  tags: ["Customers"],
  request: { params: IdParamSchema },
  responses: {
    200: {
      description: "Customer with order history and spend",
      content: { "application/json": { schema: CustomerDetailSchema } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

customerRoutes.openapi(getCustomerRoute, async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, id),
    with: {
      orders: {
        with: { items: true },
        orderBy: desc(orders.createdAt),
      },
    },
  });

  if (!customer) {
    notFound("Customer not found");
  }

  const completedOrders = customer.orders.filter((o) => o.status === "completed");
  const totalSpendCents = completedOrders.reduce(
    (sum, o) => sum + o.totalCents,
    0,
  );

  return c.json(
    {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      orderCount: customer.orders.length,
      totalSpendCents,
      orders: customer.orders,
    },
    200,
  );
});
