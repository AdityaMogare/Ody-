import { useGetOrders } from "@ody/api-client";
import { useMemo } from "react";

const PENDING_STATUSES = new Set(["pending", "accepted", "preparing"]);

export function usePendingOrderCount(): number {
  const ordersQuery = useGetOrders(undefined, {
    query: { refetchInterval: 30_000 },
  });

  const orders = ordersQuery.data?.status === 200 ? ordersQuery.data.data : [];

  return useMemo(
    () => orders.filter((order) => PENDING_STATUSES.has(order.status)).length,
    [orders],
  );
}
