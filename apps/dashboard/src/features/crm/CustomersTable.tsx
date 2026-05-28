import { Text } from "react-native";

import { DataTable, useTheme } from "../../design-system";
import { formatPriceCents } from "../../lib/menu";
import type { CustomerRow } from "./crm-data";

type CustomersTableProps = {
  customers: CustomerRow[];
  loading: boolean;
  error?: string | null;
  onSelectCustomer: (customerId: string) => void;
};

function formatLastOrderDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function CustomersTable({
  customers,
  loading,
  error,
  onSelectCustomer,
}: CustomersTableProps) {
  const theme = useTheme();

  return (
    <DataTable
      loading={loading}
      error={error}
      data={customers}
      keyExtractor={(c) => c.id}
      onRowPress={(c) => onSelectCustomer(c.id)}
      emptyTitle="No customers found"
      emptyMessage="Try a different name or email in search."
      columns={[
        {
          key: "name",
          header: "Name",
          flex: 1.2,
          render: (c) => <Text style={{ color: theme.semantic.text }}>{c.name}</Text>,
        },
        {
          key: "email",
          header: "Email",
          flex: 1.4,
          render: (c) => (
            <Text style={{ color: theme.semantic.textMuted }}>{c.email ?? "—"}</Text>
          ),
        },
        {
          key: "totalOrders",
          header: "Orders",
          flex: 0.7,
          render: (c) => <Text style={{ color: theme.semantic.text }}>{c.totalOrders}</Text>,
        },
        {
          key: "lifetimeSpend",
          header: "Lifetime spend",
          flex: 1,
          render: (c) => (
            <Text style={{ color: theme.semantic.text }}>
              {formatPriceCents(c.lifetimeSpendCents)}
            </Text>
          ),
        },
        {
          key: "lastOrderDate",
          header: "Last order",
          flex: 1,
          render: (c) => (
            <Text style={{ color: theme.semantic.textMuted }}>
              {formatLastOrderDate(c.lastOrderDate)}
            </Text>
          ),
        },
        {
          key: "chevron",
          header: "",
          flex: 0.4,
          render: () => (
            <Text style={{ color: theme.semantic.primary, fontSize: theme.typography.fontSize.lg }}>
              ›
            </Text>
          ),
        },
      ]}
    />
  );
}
