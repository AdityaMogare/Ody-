import { useGetCustomers, useGetMenuItems, useGetOrders } from "@ody/api-client";
import { Platform, ScrollView, Text, View } from "react-native";

import { useTheme } from "../design-system";
import { HomeKpiRow } from "../features/home/HomeKpiRow";
import { RecentOrdersSection } from "../features/home/RecentOrdersSection";
import { TopMenuItemsSection } from "../features/home/TopMenuItemsSection";
import { useHomeStats } from "../hooks/useHomeStats";
import { getTimeOfDayGreeting } from "../lib/time";

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

  const isWide = Platform.OS === "web";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.semantic.background }}
      contentContainerStyle={{
        padding: theme.spacing[6],
        gap: theme.spacing[6],
        maxWidth: theme.layout.maxContentWidth,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <View style={{ gap: theme.spacing[1] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.semantic.text,
          }}
        >
          {getTimeOfDayGreeting()}
        </Text>
        <Text style={{ fontSize: theme.typography.fontSize.md, color: theme.semantic.textMuted }}>
          Here&apos;s what&apos;s happening at your restaurant today.
        </Text>
      </View>

      <HomeKpiRow
        stats={stats}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
        menuLoading={menuLoading}
        menuError={menuError}
      />

      <View
        style={{
          height: 1,
          backgroundColor: theme.semantic.border,
          marginVertical: theme.spacing[1],
        }}
      />

      <View
        style={
          isWide
            ? { flexDirection: "row", gap: theme.spacing[5], alignItems: "flex-start" }
            : { gap: theme.spacing[5] }
        }
      >
        <View style={isWide ? { flex: 0.6, minWidth: 0 } : undefined}>
          <RecentOrdersSection
            orders={stats.recentOrders}
            loading={ordersLoading}
            error={ordersError}
          />
        </View>
        <View style={isWide ? { flex: 0.4, minWidth: 0 } : undefined}>
          <TopMenuItemsSection
            items={stats.topMenuItems}
            loading={menuSectionLoading}
            error={menuSectionError}
          />
        </View>
      </View>
    </ScrollView>
  );
}
