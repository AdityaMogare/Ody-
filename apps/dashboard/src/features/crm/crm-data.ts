import type { Customer, OrderWithItems } from "@ody/api-client";

export type CustomerRow = Customer & {
  totalOrders: number;
  lifetimeSpendCents: number;
  lastOrderDate: string | null;
};

export function buildCustomerRows(
  customers: Customer[],
  orders: OrderWithItems[],
): CustomerRow[] {
  const ordersByCustomer = new Map<string, OrderWithItems[]>();

  for (const order of orders) {
    if (!order.customerId) continue;
    const list = ordersByCustomer.get(order.customerId) ?? [];
    list.push(order);
    ordersByCustomer.set(order.customerId, list);
  }

  return customers.map((customer) => {
    const customerOrders = ordersByCustomer.get(customer.id) ?? [];
    const completed = customerOrders.filter((o) => o.status === "completed");
    const lifetimeSpendCents = completed.reduce((sum, o) => sum + o.totalCents, 0);
    const lastOrderDate =
      customerOrders.length === 0
        ? null
        : customerOrders.reduce((latest, order) => {
            return new Date(order.createdAt) > new Date(latest) ? order.createdAt : latest;
          }, customerOrders[0].createdAt);

    return {
      ...customer,
      totalOrders: customerOrders.length,
      lifetimeSpendCents,
      lastOrderDate,
    };
  });
}

export function filterCustomersBySearch(rows: CustomerRow[], search: string): CustomerRow[] {
  const q = search.trim().toLowerCase();
  if (!q) return rows;

  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      (row.email?.toLowerCase().includes(q) ?? false),
  );
}
