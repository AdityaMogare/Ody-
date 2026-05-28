import {
  OrderActionBodyAction,
  type OrderActionBodyAction as OrderAction,
  type OrderStatus,
} from "@ody/api-client";

export type ValidAction = {
  action: OrderAction;
  label: string;
};

export function getValidActions(status: OrderStatus): ValidAction[] {
  switch (status) {
    case "pending":
      return [
        { action: OrderActionBodyAction.accept, label: "Accept" },
        { action: OrderActionBodyAction.cancel, label: "Cancel" },
      ];
    case "accepted":
      return [
        { action: OrderActionBodyAction.start_preparing, label: "Start Preparing" },
        { action: OrderActionBodyAction.cancel, label: "Cancel" },
      ];
    case "preparing":
      return [{ action: OrderActionBodyAction.mark_ready, label: "Mark Ready" }];
    case "ready":
      return [{ action: OrderActionBodyAction.complete, label: "Complete" }];
    default:
      return [];
  }
}
