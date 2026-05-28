import type { Customer, OrderWithItems } from "@ody/api-client";

export function matchesDateRange(
  createdAt: string,
  fromDate: string,
  toDate: string,
): boolean {
  const ts = new Date(createdAt).getTime();
  if (Number.isNaN(ts)) return false;
  const fromTs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
  const toTs = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;
  if (fromTs !== null && ts < fromTs) return false;
  if (toTs !== null && ts > toTs) return false;
  return true;
}

export function getCustomerMap(customers: Customer[]): Map<string, Customer> {
  return new Map(customers.map((c) => [c.id, c]));
}

export function filterOrdersClientSide(
  orders: OrderWithItems[],
  customerMap: Map<string, Customer>,
  search: string,
  fromDate: string,
  toDate: string,
): OrderWithItems[] {
  const q = search.trim().toLowerCase();
  return orders.filter((order) => {
    const customerName = order.customerId
      ? customerMap.get(order.customerId)?.name ?? ""
      : "Walk-in";
    const nameMatch = !q || customerName.toLowerCase().includes(q);
    return nameMatch && matchesDateRange(order.createdAt, fromDate, toDate);
  });
}
