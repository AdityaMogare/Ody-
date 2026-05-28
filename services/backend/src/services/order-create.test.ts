import { describe, expect, it, vi } from "vitest";

import type { Database } from "../db";
import { validateAndPriceOrderLines } from "./order-create";

const burger = {
  id: "00000000-0000-4000-8000-000000000010",
  categoryId: "00000000-0000-4000-8000-000000000001",
  name: "Burger",
  description: null,
  priceCents: 1500,
  available: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const soldOut = {
  ...burger,
  id: "00000000-0000-4000-8000-000000000011",
  name: "Sold Out",
  available: false,
};

function mockDb(rows: (typeof burger)[]) {
  return {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(rows),
      }),
    }),
  } as unknown as Database;
}

describe("validateAndPriceOrderLines", () => {
  it("prices lines and verifies totals", async () => {
    const db = mockDb([burger]);
    const result = await validateAndPriceOrderLines(db, {
      items: [{ menuItemId: burger.id, quantity: 2 }],
      subtotalCents: 3000,
      taxCents: 240,
      totalCents: 3240,
    });
    expect(result.lines[0].lineTotalCents).toBe(3000);
    expect(result.totalCents).toBe(3240);
  });

  it("rejects unavailable menu items", async () => {
    const db = mockDb([soldOut]);
    await expect(
      validateAndPriceOrderLines(db, {
        items: [{ menuItemId: soldOut.id, quantity: 1 }],
        subtotalCents: 1500,
        taxCents: 0,
        totalCents: 1500,
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejects mismatched subtotal", async () => {
    const db = mockDb([burger]);
    await expect(
      validateAndPriceOrderLines(db, {
        items: [{ menuItemId: burger.id, quantity: 1 }],
        subtotalCents: 9999,
        taxCents: 0,
        totalCents: 9999,
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejects mismatched total", async () => {
    const db = mockDb([burger]);
    await expect(
      validateAndPriceOrderLines(db, {
        items: [{ menuItemId: burger.id, quantity: 1 }],
        subtotalCents: 1500,
        taxCents: 100,
        totalCents: 1500,
      }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
