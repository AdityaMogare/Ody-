import { useGetCustomers, useGetOrders, type OrderWithItems } from "@ody/api-client";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { OrderDetailDrawer } from "../components/OrderDetailDrawer";
import { useTheme } from "../design-system";
import { CustomerDetailDrawer } from "../features/crm/CustomerDetailDrawer";
import { CustomerSearchBar } from "../features/crm/CustomerSearchBar";
import { CustomersTable } from "../features/crm/CustomersTable";
import { buildCustomerRows, filterCustomersBySearch } from "../features/crm/crm-data";

export function CRMScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  const customersQuery = useGetCustomers();
  const ordersQuery = useGetOrders();

  const customers = customersQuery.data?.status === 200 ? customersQuery.data.data : [];
  const orders = ordersQuery.data?.status === 200 ? ordersQuery.data.data : [];

  const rows = useMemo(() => buildCustomerRows(customers, orders), [customers, orders]);
  const filtered = useMemo(() => filterCustomersBySearch(rows, search), [rows, search]);

  const loading = customersQuery.isLoading || ordersQuery.isLoading;
  const error =
    customersQuery.isError || ordersQuery.isError ? "Failed to load customers." : null;

  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing[6],
        gap: theme.spacing[4],
        backgroundColor: theme.semantic.background,
      }}
    >
      <CustomerSearchBar search={search} onSearchChange={setSearch} />
      <CustomersTable
        customers={filtered}
        loading={loading}
        error={error}
        onSelectCustomer={setSelectedCustomerId}
      />
      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onOpenOrder={setSelectedOrder}
      />
      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </View>
  );
}
