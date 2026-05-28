import type { Customer, OrderWithItems } from "@ody/api-client";
import { Text, View } from "react-native";

import { Badge, DataTable, useTheme } from "../../design-system";
import { formatPriceCents } from "../../lib/menu";

type OrdersTableProps = {
  orders: OrderWithItems[];
  customers: Map<string, Customer>;
  loading: boolean;
  error?: string | null;
  onOpenOrder: (order: OrderWithItems) => void;
};

export function OrdersTable({
  orders,
  customers,
  loading,
  error,
  onOpenOrder,
}: OrdersTableProps) {
  const theme = useTheme();

  return (
    <DataTable
      loading={loading}
      error={error}
      data={orders}
      keyExtractor={(o) => o.id}
      onRowPress={onOpenOrder}
      emptyTitle="No matching orders"
      emptyMessage="Try adjusting filters to find orders."
      columns={[
        {
          key: "id",
          header: "Order #",
          flex: 1.1,
          render: (o) => <Text style={{ color: theme.semantic.text }}>#{o.id.slice(0, 8)}</Text>,
        },
        {
          key: "customer",
          header: "Customer",
          flex: 1.3,
          render: (o) => (
            <Text style={{ color: theme.semantic.textMuted }}>
              {o.customerId ? customers.get(o.customerId)?.name ?? "Unknown" : "Walk-in"}
            </Text>
          ),
        },
        {
          key: "items",
          header: "Items",
          flex: 1.5,
          render: (o) => (
            <Text style={{ color: theme.semantic.textMuted }}>
              {o.items.reduce((sum, i) => sum + i.quantity, 0)} items
            </Text>
          ),
        },
        {
          key: "total",
          header: "Total",
          flex: 0.9,
          render: (o) => <Text style={{ color: theme.semantic.text }}>{formatPriceCents(o.totalCents)}</Text>,
        },
        {
          key: "status",
          header: "Status",
          flex: 1,
          render: (o) => (
            <Badge
              label={o.status}
              variant={
                o.status === "completed"
                  ? "success"
                  : o.status === "cancelled"
                    ? "error"
                    : o.status === "ready"
                      ? "info"
                      : "warning"
              }
            />
          ),
        },
        {
          key: "createdAt",
          header: "Created",
          flex: 1.2,
          render: (o) => (
            <Text style={{ color: theme.semantic.textMuted }}>
              {new Date(o.createdAt).toLocaleString()}
            </Text>
          ),
        },
        {
          key: "actions",
          header: "Actions",
          flex: 0.8,
          render: () => (
            <View>
              <Text style={{ color: theme.semantic.primary }}>View</Text>
            </View>
          ),
        },
      ]}
    />
  );
}
