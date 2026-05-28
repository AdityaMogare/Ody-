import type { CustomerDetail } from "@ody/api-client";
import { useMemo } from "react";

export function useCustomerStats(customer: CustomerDetail | undefined) {
  return useMemo(() => {
    if (!customer) {
      return {
        orderCount: 0,
        lifetimeSpendCents: 0,
        averageOrderValueCents: 0,
      };
    }

    const completedCount = customer.orders.filter((o) => o.status === "completed").length;
    const lifetimeSpendCents = customer.totalSpendCents;
    const averageOrderValueCents =
      completedCount > 0 ? Math.round(lifetimeSpendCents / completedCount) : 0;

    return {
      orderCount: customer.orderCount,
      lifetimeSpendCents,
      averageOrderValueCents,
    };
  }, [customer]);
}
