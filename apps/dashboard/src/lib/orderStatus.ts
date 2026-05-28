import type { OrderStatus } from "@ody/api-client";

import type { BadgeVariant } from "../design-system";

export function orderStatusVariant(status: OrderStatus): BadgeVariant {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "ready") return "info";
  if (status === "preparing") return "info";
  return "warning";
}

export function formatOrderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
