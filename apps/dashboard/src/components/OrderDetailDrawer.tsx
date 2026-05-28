import {
  getGetOrdersQueryKey,
  useGetCustomersId,
  useGetMenuItems,
  usePostOrdersIdActions,
  type OrderWithItems,
} from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";

import {
  Badge,
  Button,
  Drawer,
  EmptyState,
  Skeleton,
  useTheme,
  useToast,
} from "../design-system";
import { DrawerSectionTitle } from "./drawer/DrawerSectionTitle";
import { DrawerStat } from "./drawer/DrawerStat";
import { formatPriceCents } from "../lib/menu";
import { formatOrderStatusLabel, orderStatusVariant } from "../lib/orderStatus";
import { getValidActions } from "../utils/orderActions";

type OrderDetailDrawerProps = {
  order: OrderWithItems | null;
  onClose: () => void;
};

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const theme = useTheme();
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

  const validActions = order ? getValidActions(order.status) : [];
  const orderTitle = order ? `Order #${order.id.slice(0, 8)}` : "Order";

  return (
    <Drawer visible={Boolean(order)} title={orderTitle} onClose={onClose}>
      {!order ? null : (
        <ScrollView contentContainerStyle={{ gap: theme.spacing[4] }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: theme.spacing[2],
              flexWrap: "wrap",
            }}
          >
            <Badge label={formatOrderStatusLabel(order.status)} variant={orderStatusVariant(order.status)} />
            <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
            <DrawerStat label="Subtotal" value={formatPriceCents(order.subtotalCents)} theme={theme} />
            <DrawerStat label="Tax" value={formatPriceCents(order.taxCents)} theme={theme} />
            <DrawerStat label="Total" value={formatPriceCents(order.totalCents)} theme={theme} />
          </View>

          <View style={{ gap: theme.spacing[2] }}>
            <DrawerSectionTitle title="Customer" theme={theme} />
            <View
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.semantic.border,
                backgroundColor: theme.semantic.surface,
                gap: theme.spacing[1],
              }}
            >
              {customerId ? (
                customerQuery.isLoading ? (
                  <>
                    <Skeleton height={20} width="50%" />
                    <Skeleton height={14} width="70%" />
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        color: theme.semantic.text,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                      }}
                    >
                      {customer?.name ?? "Unknown customer"}
                    </Text>
                    <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                      {customer?.email ?? "No email"}
                    </Text>
                    {customer?.phone ? (
                      <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                        {customer.phone}
                      </Text>
                    ) : null}
                  </>
                )
              ) : (
                <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                  Walk-in customer
                </Text>
              )}
            </View>
          </View>

          <View style={{ gap: theme.spacing[2] }}>
            <DrawerSectionTitle title="Line items" theme={theme} />
            {order.items.map((line) => (
              <View
                key={line.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: theme.spacing[2],
                  padding: theme.spacing[3],
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                  borderRadius: theme.radii.md,
                  backgroundColor: theme.semantic.surface,
                }}
              >
                <View style={{ flex: 1, gap: theme.spacing[1] }}>
                  <Text
                    style={{
                      color: theme.semantic.text,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    {itemNames.get(line.menuItemId) ?? "Unknown item"}
                  </Text>
                  <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                    {formatPriceCents(line.unitPriceCents)} × {line.quantity}
                  </Text>
                </View>
                <Text
                  style={{
                    color: theme.semantic.text,
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  {formatPriceCents(line.lineTotalCents)}
                </Text>
              </View>
            ))}
          </View>

          {order.notes ? (
            <View style={{ gap: theme.spacing[2] }}>
              <DrawerSectionTitle title="Notes" theme={theme} />
              <View
                style={{
                  padding: theme.spacing[3],
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                  backgroundColor: theme.semantic.surfaceMuted,
                }}
              >
                <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
                  {order.notes}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={{ gap: theme.spacing[2] }}>
            <DrawerSectionTitle title="Actions" theme={theme} />
            {validActions.length === 0 ? (
              <EmptyState
                title="No actions available"
                message="This order is already in a terminal state."
              />
            ) : (
              <View style={{ gap: theme.spacing[2] }}>
                {validActions.map((a) => (
                  <Button
                    key={a.action}
                    label={a.label}
                    variant={a.action === "cancel" ? "danger" : "primary"}
                    loading={actionMutation.isPending}
                    fullWidth
                    onPress={() =>
                      actionMutation.mutate({ id: order.id, data: { action: a.action } })
                    }
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </Drawer>
  );
}
