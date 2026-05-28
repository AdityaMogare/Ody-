import { inArray } from "drizzle-orm";

import type { Database } from "../db";
import { menuItems } from "../db/schema";
import { badRequest } from "../lib/errors";

export type CreateOrderLineInput = {
  menuItemId: string;
  quantity: number;
};

export type ValidatedOrderLine = {
  menuItemId: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type ValidatedOrderTotals = {
  lines: ValidatedOrderLine[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
};

export async function validateAndPriceOrderLines(
  db: Database,
  input: {
    items: CreateOrderLineInput[];
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
  },
): Promise<ValidatedOrderTotals> {
  const { items, subtotalCents, taxCents, totalCents } = input;

  if (items.length === 0) {
    badRequest("Order must include at least one item");
  }

  const menuItemIds = [...new Set(items.map((i) => i.menuItemId))];
  const rows = await db
    .select()
    .from(menuItems)
    .where(inArray(menuItems.id, menuItemIds));

  if (rows.length !== menuItemIds.length) {
    badRequest("One or more menu items were not found");
  }

  const byId = new Map(rows.map((r) => [r.id, r]));
  const lines: ValidatedOrderLine[] = [];

  for (const item of items) {
    const menuItem = byId.get(item.menuItemId);
    if (!menuItem) {
      badRequest(`Menu item not found: ${item.menuItemId}`);
    }
    if (!menuItem.available) {
      badRequest(`Menu item is unavailable: ${menuItem.name}`, {
        menuItemId: menuItem.id,
      });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      badRequest("Quantity must be a positive integer");
    }

    const lineTotalCents = menuItem.priceCents * item.quantity;
    lines.push({
      menuItemId: menuItem.id,
      quantity: item.quantity,
      unitPriceCents: menuItem.priceCents,
      lineTotalCents,
    });
  }

  const calculatedSubtotal = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  if (subtotalCents !== calculatedSubtotal) {
    badRequest("subtotalCents does not match sum of line items", {
      expected: calculatedSubtotal,
      received: subtotalCents,
    });
  }

  const calculatedTotal = calculatedSubtotal + taxCents;
  if (totalCents !== calculatedTotal) {
    badRequest("totalCents must equal subtotalCents + taxCents", {
      expected: calculatedTotal,
      received: totalCents,
    });
  }

  return {
    lines,
    subtotalCents: calculatedSubtotal,
    taxCents,
    totalCents: calculatedTotal,
  };
}
