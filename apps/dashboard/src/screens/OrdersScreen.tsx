import { useGetCustomers, useGetOrders, type OrderWithItems } from "@ody/api-client";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { useTheme } from "../design-system";
import { OrderDetailDrawer } from "../features/orders/OrderDetailDrawer";
import { OrderFiltersBar } from "../features/orders/OrderFiltersBar";
import { OrdersTable } from "../features/orders/OrdersTable";
import { filterOrdersClientSide, getCustomerMap } from "../features/orders/orders-data";
import { useOrderFilters } from "../hooks/useOrderFilters";

export function OrdersScreen() {
  const theme = useTheme();
  const filters = useOrderFilters();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  const ordersQuery = useGetOrders(filters.apiParams);
  const customersQuery = useGetCustomers();

  const orders = ordersQuery.data?.status === 200 ? ordersQuery.data.data : [];
  const customers = customersQuery.data?.status === 200 ? customersQuery.data.data : [];
  const customerMap = useMemo(() => getCustomerMap(customers), [customers]);
  const filtered = useMemo(
    () =>
      filterOrdersClientSide(
        orders,
        customerMap,
        filters.search,
        filters.fromDate,
        filters.toDate,
      ),
    [orders, customerMap, filters.search, filters.fromDate, filters.toDate],
  );

  return (
    <View style={{ flex: 1, padding: theme.spacing[6], gap: theme.spacing[4], backgroundColor: theme.semantic.background }}>
      <OrderFiltersBar {...filters} />
      <OrdersTable
        orders={filtered}
        customers={customerMap}
        loading={ordersQuery.isLoading || customersQuery.isLoading}
        error={ordersQuery.isError || customersQuery.isError ? "Failed to load orders." : null}
        onOpenOrder={setSelectedOrder}
      />
      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </View>
  );
}
