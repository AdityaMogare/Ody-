import { useGetCustomers, useGetMenuItems, useGetOrders } from "@ody/api-client";
import { ScrollView, View } from "react-native";

import { useTheme } from "../design-system";
import { HomeKpiRow } from "../features/home/HomeKpiRow";
import { HomeSectionTitle } from "../features/home/HomeSectionTitle";
import { RecentOrdersSection } from "../features/home/RecentOrdersSection";
import { TopMenuItemsSection } from "../features/home/TopMenuItemsSection";
import { useHomeStats } from "../hooks/useHomeStats";

export function HomeScreen() {
  const theme = useTheme();
  const ordersQuery = useGetOrders();
  const customersQuery = useGetCustomers();
  const menuQuery = useGetMenuItems();

  const orders = ordersQuery.data?.status === 200 ? ordersQuery.data.data : [];
  const customers = customersQuery.data?.status === 200 ? customersQuery.data.data : [];
  const menuItems = menuQuery.data?.status === 200 ? menuQuery.data.data : [];

  const stats = useHomeStats({ orders, customers, menuItems });

  const ordersLoading = ordersQuery.isLoading;
  const ordersError = ordersQuery.isError ? "Failed to load orders." : null;
  const menuLoading = menuQuery.isLoading;
  const menuError = menuQuery.isError ? "Failed to load menu." : null;
  const menuSectionLoading = ordersLoading || menuLoading;
  const menuSectionError = menuError ?? ordersError;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.semantic.background }}
      contentContainerStyle={{ padding: theme.spacing[6], gap: theme.spacing[5] }}
    >
      <HomeKpiRow
        stats={stats}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
        menuLoading={menuLoading}
        menuError={menuError}
      />

      <View style={{ gap: theme.spacing[2] }}>
        <HomeSectionTitle title="Recent orders" />
        <RecentOrdersSection
          orders={stats.recentOrders}
          loading={ordersLoading}
          error={ordersError}
        />
      </View>

      <TopMenuItemsSection
        items={stats.topMenuItems}
        loading={menuSectionLoading}
        error={menuSectionError}
      />
    </ScrollView>
  );
}
