import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  closeTestDatabase,
  ensureTestDatabase,
  getTestDb,
  resetDatabase,
  seedOrderFixtures,
  type OrderTestFixtures,
} from "./helpers/test-db";
import { testJson, testRequest } from "./helpers/test-app";

type OrderWithItems = {
  id: string;
  status: string;
  items: unknown[];
};

type ErrorBody = { error: string };

function buildOrderPayload(
  fixtures: OrderTestFixtures,
  opts: {
    menuItemId?: string;
    quantity?: number;
    subtotalCents?: number;
    taxCents?: number;
    totalCents?: number;
  } = {},
) {
  const menuItemId = opts.menuItemId ?? fixtures.availableItem.id;
  const quantity = opts.quantity ?? 1;
  const subtotalCents =
    opts.subtotalCents ?? fixtures.availableItem.priceCents * quantity;
  const taxCents = opts.taxCents ?? 0;
  const totalCents = opts.totalCents ?? subtotalCents + taxCents;

  return {
    customerId: fixtures.customerId,
    items: [{ menuItemId, quantity }],
    subtotalCents,
    taxCents,
    totalCents,
  };
}

describe("POST /orders and order actions", () => {
  let fixtures: OrderTestFixtures;

  beforeAll(async () => {
    await ensureTestDatabase();
  }, 30_000);

  afterAll(async () => {
    await closeTestDatabase();
  }, 30_000);

  beforeEach(async () => {
    const db = getTestDb();
    await resetDatabase(db);
    fixtures = await seedOrderFixtures(db);
  });

  it("rejects unavailable menu items with 400", async () => {
    const res = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        buildOrderPayload(fixtures, { menuItemId: fixtures.unavailableItem.id }),
      ),
    });

    expect(res.status).toBe(400);
    const body = await testJson<ErrorBody>(res);
    expect(body.error).toMatch(/unavailable/i);
  });

  it("rejects mismatched totals with 400", async () => {
    const res = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        buildOrderPayload(fixtures, {
          subtotalCents: fixtures.availableItem.priceCents,
          totalCents: fixtures.availableItem.priceCents + 999,
        }),
      ),
    });

    expect(res.status).toBe(400);
    const body = await testJson<ErrorBody>(res);
    expect(body.error).toMatch(/totalCents/i);
  });

  it("creates an order on the happy path with 201 and pending status", async () => {
    const res = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });

    expect(res.status).toBe(201);
    const body = await testJson<OrderWithItems>(res);
    expect(body.id).toEqual(expect.any(String));
    expect(body.status).toBe("pending");
    expect(body.items.length).toBeGreaterThan(0);
  });

  it("rejects invalid status transitions with 422", async () => {
    const createRes = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });
    const created = await testJson<OrderWithItems>(createRes);

    const res = await testRequest(`/orders/${created.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });

    expect(res.status).toBe(422);
    const body = await testJson<ErrorBody>(res);
    expect(body.error).toMatch(/not allowed/i);
  });

  it("accepts a pending order via actions and returns 200", async () => {
    const createRes = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });
    const created = await testJson<OrderWithItems>(createRes);

    const res = await testRequest(`/orders/${created.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });

    expect(res.status).toBe(200);
    const body = await testJson<{ order: OrderWithItems; previousStatus: string }>(res);
    expect(body.previousStatus).toBe("pending");
    expect(body.order.status).toBe("accepted");
  });

  it("rejects actions on a cancelled order with 422", async () => {
    const createRes = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });
    const created = await testJson<OrderWithItems>(createRes);

    await testRequest(`/orders/${created.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });

    const res = await testRequest(`/orders/${created.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });

    expect(res.status).toBe(422);
    const body = await testJson<ErrorBody>(res);
    expect(body.error).toMatch(/not allowed/i);
  });

  it("filters GET /orders by status=pending", async () => {
    const pendingRes = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });
    const pendingOrder = await testJson<OrderWithItems>(pendingRes);

    const acceptedRes = await testRequest("/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildOrderPayload(fixtures)),
    });
    const acceptedOrder = await testJson<OrderWithItems>(acceptedRes);
    await testRequest(`/orders/${acceptedOrder.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });

    const listRes = await testRequest("/orders?status=pending");
    expect(listRes.status).toBe(200);

    const orders = await testJson<OrderWithItems[]>(listRes);
    expect(orders.length).toBeGreaterThanOrEqual(1);
    expect(orders.every((o) => o.status === "pending")).toBe(true);
    expect(orders.some((o) => o.id === pendingOrder.id)).toBe(true);
    expect(orders.some((o) => o.id === acceptedOrder.id)).toBe(false);
  });
});
