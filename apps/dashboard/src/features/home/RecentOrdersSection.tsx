import type { OrderStatus } from "@ody/api-client";
import { Text } from "react-native";

import { Badge, DataTable, useTheme } from "../../design-system";
import type { RecentOrderRow } from "../../hooks/useHomeStats";
import { formatPriceCents } from "../../lib/menu";

type RecentOrdersSectionProps = {
  orders: RecentOrderRow[];
  loading: boolean;
  error: string | null;
};

function statusVariant(
  status: OrderStatus,
): "success" | "error" | "info" | "warning" {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "ready") return "info";
  return "warning";
}

export function RecentOrdersSection({ orders, loading, error }: RecentOrdersSectionProps) {
  const theme = useTheme();

  return (
    <DataTable
      loading={loading}
      error={error}
      data={orders}
      keyExtractor={(o) => o.id}
      emptyTitle="No recent orders"
      emptyMessage="Orders will appear here once placed."
      columns={[
        {
          key: "orderNumber",
          header: "Order #",
          flex: 1,
          render: (o) => <Text style={{ color: theme.semantic.text }}>#{o.orderNumber}</Text>,
        },
        {
          key: "customer",
          header: "Customer",
          flex: 1.2,
          render: (o) => (
            <Text style={{ color: theme.semantic.textMuted }}>{o.customerName}</Text>
          ),
        },
        {
          key: "total",
          header: "Total",
          flex: 0.9,
          render: (o) => (
            <Text style={{ color: theme.semantic.text }}>{formatPriceCents(o.totalCents)}</Text>
          ),
        },
        {
          key: "status",
          header: "Status",
          flex: 1,
          render: (o) => <Badge label={o.status} variant={statusVariant(o.status)} />,
        },
        {
          key: "timeAgo",
          header: "Time",
          flex: 0.8,
          render: (o) => (
            <Text style={{ color: theme.semantic.textMuted }}>{o.timeAgo}</Text>
          ),
        },
      ]}
    />
  );
}
