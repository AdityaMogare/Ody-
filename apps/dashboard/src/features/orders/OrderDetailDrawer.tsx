import {
  getGetOrdersQueryKey,
  useGetCustomersId,
  useGetMenuItems,
  usePostOrdersIdActions,
  type OrderWithItems,
} from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";

import { Button, Drawer, EmptyState, Skeleton, useToast } from "../../design-system";
import { formatPriceCents } from "../../lib/menu";
import { getValidActions } from "../../utils/orderActions";

type OrderDetailDrawerProps = {
  order: OrderWithItems | null;
  onClose: () => void;
};

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const customerId = order?.customerId ?? "";

  const customerQuery = useGetCustomersId(customerId, {
    query: { enabled: Boolean(customerId) },
  });
  const menuItemsQuery = useGetMenuItems();

  const actionMutation = usePostOrdersIdActions({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 200) return;
        queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
        toast.show({ title: "Order updated", variant: "success" });
        onClose();
      },
      onError: () => toast.show({ title: "Failed to update order", variant: "error" }),
    },
  });

  const menuItems = menuItemsQuery.data?.status === 200 ? menuItemsQuery.data.data : [];
  const itemNames = new Map(menuItems.map((m) => [m.id, m.name]));
  const customer =
    customerQuery.data?.status === 200 ? customerQuery.data.data : null;

  return (
    <Drawer visible={Boolean(order)} title="Order Details" onClose={onClose}>
      {!order ? null : (
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          <View>
            <Text>Customer</Text>
            {customerId ? (
              customerQuery.isLoading ? (
                <Skeleton height={32} />
              ) : (
                <View>
                  <Text>{customer?.name ?? "Unknown customer"}</Text>
                  <Text>{customer?.email ?? "No email"}</Text>
                  <Text>{customer?.phone ?? "No phone"}</Text>
                </View>
              )
            ) : (
              <Text>Walk-in customer</Text>
            )}
          </View>

          <View>
            <Text>Line items</Text>
            {order.items.map((line) => (
              <View
                key={line.id}
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Text>
                  {itemNames.get(line.menuItemId) ?? "Unknown item"} x{line.quantity}
                </Text>
                <Text>{formatPriceCents(line.lineTotalCents)}</Text>
              </View>
            ))}
          </View>

          <View>
            <Text>Total: {formatPriceCents(order.totalCents)}</Text>
            <Text>Created: {new Date(order.createdAt).toLocaleString()}</Text>
          </View>

          <View style={{ gap: 8 }}>
            {getValidActions(order.status).length === 0 ? (
              <EmptyState
                title="No actions available"
                message="This order is already in a terminal state."
              />
            ) : (
              getValidActions(order.status).map((a) => (
                <Button
                  key={a.action}
                  label={a.label}
                  loading={actionMutation.isPending}
                  onPress={() =>
                    actionMutation.mutate({ id: order.id, data: { action: a.action } })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </Drawer>
  );
}
