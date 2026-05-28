import type { GetOrdersParams, GetOrdersStatus } from "@ody/api-client";
import { useMemo, useState } from "react";

export type OrderStatusFilter = "all" | GetOrdersStatus;

export function useOrderFilters() {
  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const apiParams: GetOrdersParams = useMemo(
    () => ({
      status: status === "all" ? undefined : status,
    }),
    [status],
  );

  return {
    status,
    setStatus,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    apiParams,
  };
}
