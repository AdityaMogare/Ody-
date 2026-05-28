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
} from "../src/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ody";

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

  const burger = items.find((i) => i.name === "Classic Burger")!;
  const pizza = items.find((i) => i.name === "Margherita Pizza")!;
  const tea = items.find((i) => i.name === "House Iced Tea")!;

  const [alice, bob] = await db
    .insert(customers)
    .values([
      {
        name: "Alice Chen",
        email: "alice@example.com",
        phone: "+1-555-0101",
      },
      {
        name: "Bob Martinez",
        email: "bob@example.com",
        phone: "+1-555-0102",
      },
    ])
    .returning();

  const aliceLines = [
    {
      menuItemId: burger.id,
      quantity: 1,
      unitPriceCents: burger.priceCents,
      lineTotalCents: burger.priceCents,
    },
    {
      menuItemId: tea.id,
      quantity: 2,
      unitPriceCents: tea.priceCents,
      lineTotalCents: tea.priceCents * 2,
    },
  ];
  const aliceSubtotal = aliceLines.reduce((s, l) => s + l.lineTotalCents, 0);
  const aliceTax = Math.round(aliceSubtotal * 0.08);
  const [aliceOrder] = await db
    .insert(orders)
    .values({
      customerId: alice.id,
      status: "completed",
      subtotalCents: aliceSubtotal,
      taxCents: aliceTax,
      totalCents: aliceSubtotal + aliceTax,
      notes: "No onions",
    })
    .returning();
  await db.insert(orderItems).values(
    aliceLines.map((l) => ({ ...l, orderId: aliceOrder.id })),
  );

  const bobLines = [
    {
      menuItemId: pizza.id,
      quantity: 1,
      unitPriceCents: pizza.priceCents,
      lineTotalCents: pizza.priceCents,
    },
  ];
  const bobSubtotal = bobLines.reduce((s, l) => s + l.lineTotalCents, 0);
  const [bobOrder] = await db
    .insert(orders)
    .values({
      customerId: bob.id,
      status: "preparing",
      subtotalCents: bobSubtotal,
      taxCents: 0,
      totalCents: bobSubtotal,
    })
    .returning();
  await db.insert(orderItems).values(
    bobLines.map((l) => ({ ...l, orderId: bobOrder.id })),
  );

  const walkInLines = [
    {
      menuItemId: burger.id,
      quantity: 2,
      unitPriceCents: burger.priceCents,
      lineTotalCents: burger.priceCents * 2,
    },
  ];
  const walkInSubtotal = walkInLines.reduce((s, l) => s + l.lineTotalCents, 0);
  const [pendingOrder] = await db
    .insert(orders)
    .values({
      customerId: null,
      status: "pending",
      subtotalCents: walkInSubtotal,
      taxCents: 0,
      totalCents: walkInSubtotal,
      notes: "Walk-in",
    })
    .returning();
  await db.insert(orderItems).values(
    walkInLines.map((l) => ({ ...l, orderId: pendingOrder.id })),
  );

  console.log("Seed complete:", {
    categories: 3,
    menuItems: items.length,
    customers: 2,
    orders: 3,
  });
  console.log(
    "Sample IDs — pending order:",
    pendingOrder.id,
    "| customer:",
    alice.id,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
