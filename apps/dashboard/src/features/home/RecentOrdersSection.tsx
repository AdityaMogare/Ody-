import type { OrderStatus } from "@ody/api-client";
import { Text, View } from "react-native";

import { Badge, Card, DataTable, useTheme, type BadgeVariant } from "../../design-system";
import type { RecentOrderRow } from "../../hooks/useHomeStats";
import { formatPriceCents } from "../../lib/menu";

type RecentOrdersSectionProps = {
  orders: RecentOrderRow[];
  loading: boolean;
  error: string | null;
};

function statusVariant(status: OrderStatus): BadgeVariant {
  if (status === "completed") return "success";
  if (status === "cancelled") return "error";
  if (status === "preparing") return "info";
  if (status === "pending") return "warning";
  if (status === "ready") return "info";
  return "warning";
}

function formatStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function RecentOrdersSection({ orders, loading, error }: RecentOrdersSectionProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ flex: 1, minWidth: 0, padding: 0, gap: 0, overflow: "hidden" }}>
      <View style={{ padding: theme.spacing[4], paddingBottom: theme.spacing[3] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.semantic.text,
          }}
        >
          Recent orders
        </Text>
      </View>
      <DataTable
        style={{ borderWidth: 0, borderRadius: 0 }}
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
            render: (o) => (
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily.mono,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.semantic.textMuted,
                }}
              >
                #{o.orderNumber}
              </Text>
            ),
          },
          {
            key: "customer",
            header: "Customer",
            flex: 1.2,
            render: (o) => (
              <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
                {o.customerName}
              </Text>
            ),
          },
          {
            key: "total",
            header: "Total",
            flex: 0.9,
            render: (o) => (
              <Text
                style={{
                  color: theme.semantic.text,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {formatPriceCents(o.totalCents)}
              </Text>
            ),
          },
          {
            key: "status",
            header: "Status",
            flex: 1,
            render: (o) => (
              <Badge label={formatStatusLabel(o.status)} variant={statusVariant(o.status)} />
            ),
          },
          {
            key: "timeAgo",
            header: "Time",
            flex: 0.8,
            render: (o) => (
              <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                {o.timeAgo}
              </Text>
            ),
          },
        ]}
      />
    </Card>
  );
}
