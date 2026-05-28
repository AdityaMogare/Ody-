import type { Customer, OrderWithItems } from "@ody/api-client";
import { Pressable, Text } from "react-native";

import { Badge, DataTable, useTheme } from "../../design-system";
import { formatPriceCents } from "../../lib/menu";

type OrdersTableProps = {
  orders: OrderWithItems[];
  customers: Map<string, Customer>;
  loading: boolean;
  error?: string | null;
  onOpenOrder: (order: OrderWithItems) => void;
  onSelectCustomer: (customerId: string) => void;
};

function statusVariant(
  status: OrderWithItems["status"],
): "success" | "error" | "info" | "warning" {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "ready") return "info";
  return "warning";
}

export function OrdersTable({
  orders,
  customers,
  loading,
  error,
  onOpenOrder,
  onSelectCustomer,
}: OrdersTableProps) {
  const theme = useTheme();

  return (
    <DataTable
      loading={loading}
      error={error}
      data={orders}
      keyExtractor={(o) => o.id}
      emptyTitle="No matching orders"
      emptyMessage="Try adjusting filters to find orders."
      columns={[
        {
          key: "id",
          header: "Order #",
          flex: 1.1,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)} accessibilityRole="button">
              <Text
                style={{
                  color: theme.semantic.text,
                  fontFamily: theme.typography.fontFamily.mono,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                #{o.id.slice(0, 8)}
              </Text>
            </Pressable>
          ),
        },
        {
          key: "customer",
          header: "Customer",
          flex: 1.3,
          render: (o) => {
            if (!o.customerId) {
              return <Text style={{ color: theme.semantic.textMuted }}>Walk-in</Text>;
            }
            const name = customers.get(o.customerId)?.name ?? "Unknown";
            return (
              <Pressable
                onPress={() => onSelectCustomer(o.customerId!)}
                accessibilityRole="button"
                accessibilityLabel={`View customer ${name}`}
                style={({ pressed, hovered }) => [
                  pressed || hovered ? { opacity: 0.85 } : undefined,
                ]}
              >
                <Text
                  style={{
                    color: theme.semantic.text,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {name}
                </Text>
              </Pressable>
            );
          },
        },
        {
          key: "items",
          header: "Items",
          flex: 1.5,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)}>
              <Text style={{ color: theme.semantic.textMuted }}>
                {o.items.reduce((sum, i) => sum + i.quantity, 0)} items
              </Text>
            </Pressable>
          ),
        },
        {
          key: "total",
          header: "Total",
          flex: 0.9,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)}>
              <Text style={{ color: theme.semantic.text }}>{formatPriceCents(o.totalCents)}</Text>
            </Pressable>
          ),
        },
        {
          key: "status",
          header: "Status",
          flex: 1,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)}>
              <Badge label={o.status} variant={statusVariant(o.status)} />
            </Pressable>
          ),
        },
        {
          key: "createdAt",
          header: "Created",
          flex: 1.2,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)}>
              <Text style={{ color: theme.semantic.textMuted }}>
                {new Date(o.createdAt).toLocaleString()}
              </Text>
            </Pressable>
          ),
        },
        {
          key: "actions",
          header: "",
          flex: 0.4,
          render: (o) => (
            <Pressable onPress={() => onOpenOrder(o)} accessibilityRole="button">
              <Text style={{ color: theme.semantic.primary, fontSize: theme.typography.fontSize.lg }}>
                ›
              </Text>
            </Pressable>
          ),
        },
      ]}
    />
  );
}
