import { usePathname } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { NavItem } from "./NavItem";
import { TAB_ROUTES } from "./routes";
import { usePendingOrderCount } from "./usePendingOrderCount";

function createTabBarStyles(t: Theme) {
  return {
    bar: {
      flexDirection: "row" as const,
      borderTopWidth: 1,
      borderTopColor: t.semantic.border,
      backgroundColor: t.semantic.surface,
      paddingHorizontal: t.spacing[2],
      paddingTop: t.spacing[1],
    },
  };
}

export function DashboardTabBar() {
  const styles = useStyles(createTabBarStyles);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const pendingCount = usePendingOrderCount();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TAB_ROUTES.map((route) => (
        <NavItem
          key={route.href}
          route={route}
          pathname={pathname}
          layout="tab"
          badgeCount={route.showPendingBadge ? pendingCount : 0}
        />
      ))}
    </View>
  );
}
