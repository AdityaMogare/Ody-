import "dotenv/config";

import { createDb } from "../src/db";
import { DEFAULT_OPENING_HOURS } from "../src/db/constants";
import {
  customers,
  menuCategories,
  menuItems,
  orderItems,
  orders,
  restaurantSettings,
  type OrderStatus,
} from "../src/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ody";

const TAX_RATE = 0.08;

type MenuItemRow = typeof menuItems.$inferSelect;

type LineSpec = { itemName: string; quantity: number };

type OrderSpec = {
  customerIndex: number | null;
  status: OrderStatus;
  createdAt: Date;
  lines: LineSpec[];
  notes?: string;
  applyTax?: boolean;
};

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

function daysAgo(days: number, hour = 12, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function itemByName(items: MenuItemRow[], name: string): MenuItemRow {
  const item = items.find((i) => i.name === name);
  if (!item) throw new Error(`Menu item not found: ${name}`);
  if (!item.available) throw new Error(`Menu item unavailable: ${name}`);
  return item;
}

function buildLines(items: MenuItemRow[], specs: LineSpec[]) {
  return specs.map((spec) => {
    const item = itemByName(items, spec.itemName);
    return {
      menuItemId: item.id,
      quantity: spec.quantity,
      unitPriceCents: item.priceCents,
      lineTotalCents: item.priceCents * spec.quantity,
    };
  });
}

function totals(lines: ReturnType<typeof buildLines>, applyTax = true) {
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const taxCents = applyTax ? Math.round(subtotalCents * TAX_RATE) : 0;
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

/** ~30 curated orders: ~60% today, skewed item popularity, all statuses. */
const ORDER_SPECS: OrderSpec[] = [
  // —— Today (active pipeline) ——
  { customerIndex: null, status: "pending", createdAt: minutesAgo(8), lines: [{ itemName: "Classic Burger", quantity: 2 }], notes: "Walk-in" },
  { customerIndex: 1, status: "pending", createdAt: minutesAgo(14), lines: [{ itemName: "Margherita Pizza", quantity: 1 }, { itemName: "Sparkling Water", quantity: 1 }] },
  { customerIndex: 4, status: "pending", createdAt: minutesAgo(22), lines: [{ itemName: "Garlic Bread", quantity: 1 }, { itemName: "House Iced Tea", quantity: 2 }] },
  { customerIndex: 2, status: "accepted", createdAt: minutesAgo(35), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "House Iced Tea", quantity: 1 }] },
  { customerIndex: 7, status: "accepted", createdAt: minutesAgo(48), lines: [{ itemName: "Soup of the Day", quantity: 1 }, { itemName: "Sparkling Water", quantity: 2 }] },
  { customerIndex: 1, status: "preparing", createdAt: minutesAgo(55), lines: [{ itemName: "Margherita Pizza", quantity: 1 }] },
  { customerIndex: 3, status: "preparing", createdAt: minutesAgo(72), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "Garlic Bread", quantity: 1 }] },
  { customerIndex: 8, status: "preparing", createdAt: minutesAgo(90), lines: [{ itemName: "Classic Burger", quantity: 2 }, { itemName: "House Iced Tea", quantity: 2 }] },
  { customerIndex: 5, status: "ready", createdAt: minutesAgo(105), lines: [{ itemName: "Margherita Pizza", quantity: 1 }, { itemName: "House Iced Tea", quantity: 1 }] },
  { customerIndex: 0, status: "ready", createdAt: minutesAgo(120), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "Sparkling Water", quantity: 1 }], notes: "Extra pickles" },
  { customerIndex: 0, status: "completed", createdAt: minutesAgo(95), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "House Iced Tea", quantity: 2 }], notes: "No onions" },
  { customerIndex: 2, status: "completed", createdAt: minutesAgo(150), lines: [{ itemName: "Margherita Pizza", quantity: 1 }] },
  { customerIndex: 6, status: "completed", createdAt: minutesAgo(180), lines: [{ itemName: "Classic Burger", quantity: 2 }] },
  { customerIndex: 9, status: "completed", createdAt: minutesAgo(210), lines: [{ itemName: "Garlic Bread", quantity: 2 }, { itemName: "House Iced Tea", quantity: 1 }] },
  { customerIndex: 4, status: "completed", createdAt: minutesAgo(260), lines: [{ itemName: "Soup of the Day", quantity: 1 }, { itemName: "Classic Burger", quantity: 1 }] },
  { customerIndex: null, status: "completed", createdAt: minutesAgo(300), lines: [{ itemName: "House Iced Tea", quantity: 3 }], notes: "Walk-in — to go" },
  { customerIndex: 3, status: "completed", createdAt: minutesAgo(360), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "Margherita Pizza", quantity: 1 }] },
  { customerIndex: 5, status: "cancelled", createdAt: minutesAgo(400), lines: [{ itemName: "Margherita Pizza", quantity: 2 }], notes: "Customer no-show", applyTax: false },
  // —— Last 7 days (history) ——
  { customerIndex: 0, status: "completed", createdAt: daysAgo(1, 19, 15), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "House Iced Tea", quantity: 1 }] },
  { customerIndex: 1, status: "completed", createdAt: daysAgo(1, 13, 40), lines: [{ itemName: "Margherita Pizza", quantity: 1 }, { itemName: "Sparkling Water", quantity: 1 }] },
  { customerIndex: 2, status: "completed", createdAt: daysAgo(2, 18, 50), lines: [{ itemName: "Classic Burger", quantity: 2 }] },
  { customerIndex: 3, status: "completed", createdAt: daysAgo(2, 12, 10), lines: [{ itemName: "Garlic Bread", quantity: 1 }, { itemName: "Soup of the Day", quantity: 1 }] },
  { customerIndex: 4, status: "completed", createdAt: daysAgo(3, 20, 5), lines: [{ itemName: "House Iced Tea", quantity: 4 }] },
  { customerIndex: 6, status: "completed", createdAt: daysAgo(3, 11, 30), lines: [{ itemName: "Classic Burger", quantity: 1 }] },
  { customerIndex: 7, status: "completed", createdAt: daysAgo(4, 17, 45), lines: [{ itemName: "Margherita Pizza", quantity: 2 }, { itemName: "House Iced Tea", quantity: 2 }] },
  { customerIndex: 8, status: "completed", createdAt: daysAgo(5, 14, 20), lines: [{ itemName: "Classic Burger", quantity: 1 }, { itemName: "Garlic Bread", quantity: 1 }] },
  { customerIndex: 9, status: "completed", createdAt: daysAgo(5, 19, 55), lines: [{ itemName: "Soup of the Day", quantity: 2 }] },
  { customerIndex: null, status: "completed", createdAt: daysAgo(6, 16, 0), lines: [{ itemName: "Classic Burger", quantity: 1 }], notes: "Walk-in" },
  { customerIndex: 5, status: "cancelled", createdAt: daysAgo(6, 13, 15), lines: [{ itemName: "Classic Burger", quantity: 1 }], notes: "Wrong item ordered", applyTax: false },
  { customerIndex: 8, status: "completed", createdAt: daysAgo(7, 12, 45), lines: [{ itemName: "Margherita Pizza", quantity: 1 }, { itemName: "Sparkling Water", quantity: 2 }] },
];

async function main() {
  const db = createDb(DATABASE_URL);

  console.log("Clearing existing data…");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(menuItems);
  await db.delete(menuCategories);
  await db.delete(customers);
  await db.delete(restaurantSettings);

  const [settings] = await db
    .insert(restaurantSettings)
    .values({
      restaurantName: "Ody Kitchen",
      prepTimeMinutes: 20,
      autoAcceptOrders: false,
      serviceAvailable: true,
      openingHours: DEFAULT_OPENING_HOURS,
    })
    .returning();
  console.log("Settings:", settings.id);

  const [starters, mains, drinks] = await db
    .insert(menuCategories)
    .values([
      { name: "Starters", sortOrder: 1 },
      { name: "Mains", sortOrder: 2 },
      { name: "Drinks", sortOrder: 3 },
    ])
    .returning();

  const items = await db
    .insert(menuItems)
    .values([
      {
        categoryId: starters.id,
        name: "Garlic Bread",
        description: "Toasted sourdough with herb butter",
        priceCents: 599,
        available: true,
      },
      {
        categoryId: starters.id,
        name: "Soup of the Day",
        description: "Chef's seasonal soup",
        priceCents: 799,
        available: true,
      },
      {
        categoryId: mains.id,
        name: "Classic Burger",
        description: "Angus beef, cheddar, pickles",
        priceCents: 1599,
        available: true,
      },
      {
        categoryId: mains.id,
        name: "Margherita Pizza",
        description: "Tomato, mozzarella, basil",
        priceCents: 1399,
        available: true,
      },
      {
        categoryId: mains.id,
        name: "Seasonal Pasta",
        description: "Unavailable — sold out for demo",
        priceCents: 1499,
        available: false,
      },
      {
        categoryId: drinks.id,
        name: "Sparkling Water",
        priceCents: 399,
        available: true,
      },
      {
        categoryId: drinks.id,
        name: "House Iced Tea",
        priceCents: 449,
        available: true,
      },
    ])
    .returning();

  const customerRows = await db
    .insert(customers)
    .values([
      { name: "Alice Chen", email: "alice@example.com", phone: "+1-555-0101" },
      { name: "Bob Martinez", email: "bob@example.com", phone: "+1-555-0102" },
      { name: "Carmen Ruiz", email: "carmen@example.com", phone: "+1-555-0103" },
      { name: "David Kim", email: "david@example.com", phone: "+1-555-0104" },
      { name: "Elena Novak", email: "elena@example.com", phone: "+1-555-0105" },
      { name: "Frank O'Brien", email: "frank@example.com", phone: "+1-555-0106" },
      { name: "Grace Patel", email: "grace@example.com", phone: "+1-555-0107" },
      { name: "Hugo Silva", email: "hugo@example.com", phone: "+1-555-0108" },
      { name: "Ivy Nguyen", email: "ivy@example.com", phone: "+1-555-0109" },
      { name: "James Wright", email: "james@example.com", phone: "+1-555-0110" },
    ])
    .returning();

  let pendingSampleId: string | null = null;

  for (const spec of ORDER_SPECS) {
    const lines = buildLines(items, spec.lines);
    const { subtotalCents, taxCents, totalCents } = totals(
      lines,
      spec.applyTax !== false,
    );
    const customerId =
      spec.customerIndex === null
        ? null
        : customerRows[spec.customerIndex]?.id ?? null;

    const [order] = await db
      .insert(orders)
      .values({
        customerId,
        status: spec.status,
        subtotalCents,
        taxCents,
        totalCents,
        notes: spec.notes,
        createdAt: spec.createdAt,
        updatedAt: spec.createdAt,
      })
      .returning();

    if (spec.status === "pending" && pendingSampleId === null) {
      pendingSampleId = order.id;
    }

    await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
  }

  const statusCounts = ORDER_SPECS.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Seed complete:", {
    categories: 3,
    menuItems: items.length,
    customers: customerRows.length,
    orders: ORDER_SPECS.length,
    ordersByStatus: statusCounts,
  });
  console.log(
    "Sample IDs — pending order:",
    pendingSampleId,
    "| customer:",
    customerRows[0]?.id,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
