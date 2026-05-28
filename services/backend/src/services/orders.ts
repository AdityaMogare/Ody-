import { eq } from "drizzle-orm";

import type { Database } from "../db";
import { orderItems, orders } from "../db/schema";
import { notFound } from "../lib/errors";

export async function getOrderWithItems(db: Database, orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });
  if (!order) {
    notFound("Order not found");
  }
  return order;
}

export async function listOrdersWithItems(
  db: Database,
  filters: {
    status?: (typeof orders.$inferSelect)["status"];
    customerId?: string;
    limit: number;
    offset: number;
  },
) {
  const rows = await db.query.orders.findMany({
    where: (table, { and, eq: eqFn }) => {
      const clauses = [];
      if (filters.status) {
        clauses.push(eqFn(table.status, filters.status));
      }
      if (filters.customerId) {
        clauses.push(eqFn(table.customerId, filters.customerId));
      }
      return clauses.length > 0 ? and(...clauses) : undefined;
    },
    with: { items: true },
    orderBy: (table, { desc }) => desc(table.createdAt),
    limit: filters.limit,
    offset: filters.offset,
  });
  return rows;
}

export async function insertOrderItems(
  db: Database,
  orderId: string,
  lines: {
    menuItemId: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[],
) {
  if (lines.length === 0) return;
  await db.insert(orderItems).values(
    lines.map((line) => ({
      orderId,
      menuItemId: line.menuItemId,
      quantity: line.quantity,
      unitPriceCents: line.unitPriceCents,
      lineTotalCents: line.lineTotalCents,
    })),
  );
}
