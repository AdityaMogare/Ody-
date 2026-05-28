import { View } from "react-native";

import { KpiCard, useTheme } from "../../design-system";
import type { HomeStats } from "../../hooks/useHomeStats";

type HomeKpiRowProps = {
  stats: HomeStats;
  ordersLoading: boolean;
  ordersError: string | null;
  menuLoading: boolean;
  menuError: string | null;
};

export function HomeKpiRow({
  stats,
  ordersLoading,
  ordersError,
  menuLoading,
  menuError,
}: HomeKpiRowProps) {
  const theme = useTheme();
  const menuDataError = menuError ?? ordersError;
  const menuDataLoading = menuLoading || ordersLoading;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
      <KpiCard
        label="Orders today"
        value={String(stats.totalOrdersToday)}
        loading={ordersLoading}
        error={ordersError}
      />
      <KpiCard
        label="Revenue today"
        value={stats.revenueTodayFormatted}
        loading={ordersLoading}
        error={ordersError}
      />
      <KpiCard
        label="Pending orders"
        value={String(stats.pendingOrders)}
        loading={ordersLoading}
        error={ordersError}
      />
      <KpiCard
        label="Most popular item"
        value={stats.mostPopularItemName}
        loading={menuDataLoading}
        error={menuDataError}
      />
    </View>
  );
}
