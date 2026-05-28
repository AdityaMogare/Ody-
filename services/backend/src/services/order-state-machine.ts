import type { OrderStatus } from "../db/schema";

export const orderActions = [
  "accept",
  "start_preparing",
  "mark_ready",
  "complete",
  "cancel",
] as const;

export type OrderAction = (typeof orderActions)[number];

/** Explicit transitions — status is never set from an arbitrary client field. */
const transitions: Record<
  OrderAction,
  { from: readonly OrderStatus[]; to: OrderStatus }
> = {
  accept: { from: ["pending"], to: "accepted" },
  start_preparing: { from: ["accepted"], to: "preparing" },
  mark_ready: { from: ["preparing"], to: "ready" },
  complete: { from: ["ready"], to: "completed" },
  cancel: {
    from: ["pending", "accepted", "preparing", "ready"],
    to: "cancelled",
  },
};

export function getNextStatus(
  current: OrderStatus,
  action: OrderAction,
): OrderStatus | null {
  const rule = transitions[action];
  if (!rule.from.includes(current)) {
    return null;
  }
  return rule.to;
}

export function allowedActions(current: OrderStatus): OrderAction[] {
  return orderActions.filter((action) => getNextStatus(current, action) !== null);
}
