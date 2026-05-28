import { useGetCustomersId, type OrderWithItems } from "@ody/api-client";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Badge, Drawer, EmptyState, Skeleton, useTheme } from "../../design-system";
import { useCustomerStats } from "../../hooks/useCustomerStats";
import { formatPriceCents } from "../../lib/menu";

type CustomerDetailDrawerProps = {
  customerId: string | null;
  onClose: () => void;
  onOpenOrder: (order: OrderWithItems) => void;
};

function orderStatusVariant(
  status: OrderWithItems["status"],
): "success" | "error" | "info" | "warning" {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "ready") return "info";
  return "warning";
}

export function CustomerDetailDrawer({
  customerId,
  onClose,
  onOpenOrder,
}: CustomerDetailDrawerProps) {
  const theme = useTheme();
  const detailQuery = useGetCustomersId(customerId ?? "", {
    query: { enabled: Boolean(customerId) },
  });

  const customer = detailQuery.data?.status === 200 ? detailQuery.data.data : undefined;
  const stats = useCustomerStats(customer);

  const orders = useMemo(() => {
    if (!customer) return [];
    return [...customer.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [customer]);

  return (
    <Drawer visible={Boolean(customerId)} title={customer?.name ?? "Customer"} onClose={onClose}>
      {detailQuery.isLoading ? (
        <View style={{ gap: theme.spacing[3] }}>
          <Skeleton height={24} />
          <Skeleton height={16} />
          <Skeleton height={80} />
          <Skeleton height={120} />
        </View>
      ) : detailQuery.isError || !customer ? (
        <EmptyState title="Customer not found" message="This customer may have been removed." />
      ) : (
        <ScrollView contentContainerStyle={{ gap: theme.spacing[4] }}>
          <View style={{ gap: theme.spacing[1] }}>
            <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.lg }}>
              {customer.name}
            </Text>
            <Text style={{ color: theme.semantic.textMuted }}>{customer.email ?? "No email"}</Text>
            <Text style={{ color: theme.semantic.textMuted }}>
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
            <Stat label="Total orders" value={String(stats.orderCount)} theme={theme} />
            <Stat
              label="Lifetime spend"
              value={formatPriceCents(stats.lifetimeSpendCents)}
              theme={theme}
            />
            <Stat
              label="Avg order value"
              value={formatPriceCents(stats.averageOrderValueCents)}
              theme={theme}
            />
          </View>

          <View style={{ gap: theme.spacing[2] }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.semantic.text,
              }}
            >
              Order history
            </Text>
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" message="This customer has not placed any orders." />
            ) : (
              orders.map((order) => (
                <Pressable
                  key={order.id}
                  onPress={() => onOpenOrder(order)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: theme.spacing[2],
                    padding: theme.spacing[3],
                    borderWidth: 1,
                    borderColor: theme.semantic.border,
                    borderRadius: theme.radii.md,
                    backgroundColor: pressed ? theme.semantic.surfaceMuted : theme.semantic.surface,
                  })}
                >
                  <View style={{ flex: 1, gap: theme.spacing[1] }}>
                    <Text style={{ color: theme.semantic.text }}>#{order.id.slice(0, 8)}</Text>
                    <Text style={{ color: theme.semantic.textMuted }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Badge label={order.status} variant={orderStatusVariant(order.status)} />
                  <Text style={{ color: theme.semantic.text }}>
                    {formatPriceCents(order.totalCents)}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </Drawer>
  );
}

function Stat({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View
      style={{
        minWidth: 120,
        padding: theme.spacing[3],
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        backgroundColor: theme.semantic.surfaceMuted,
        gap: theme.spacing[1],
      }}
    >
      <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.xs }}>
        {label}
      </Text>
      <Text
        style={{
          color: theme.semantic.text,
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
