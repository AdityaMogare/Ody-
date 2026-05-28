import { usePathname } from "expo-router";
import { Platform, Text, View } from "react-native";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { useTheme } from "../design-system/theme";
import { layout } from "../design-system/tokens";
import { NavItem } from "./NavItem";
import { TAB_ROUTES } from "./routes";
import { usePendingOrderCount } from "./usePendingOrderCount";

function createSidebarStyles(t: Theme) {
  return {
    sidebar: {
      width: layout.sidebarWidth,
      borderRightWidth: 1,
      borderRightColor: t.semantic.border,
      backgroundColor: t.semantic.surface,
      paddingVertical: t.spacing[5],
      paddingHorizontal: t.spacing[3],
      gap: t.spacing[2],
      ...(Platform.OS === "web" ? { height: "100vh" as unknown as number } : { flex: 1 }),
    },
    brand: {
      paddingHorizontal: t.spacing[3],
      paddingBottom: t.spacing[4],
      gap: t.spacing[1],
    },
    brandTitle: {
      fontSize: t.typography.fontSize.lg,
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
    },
    brandSubtitle: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.textMuted,
    },
    nav: { gap: t.spacing[1] },
  };
}

export function DashboardSidebar() {
  const theme = useTheme();
  const styles = useStyles(createSidebarStyles);
  const pathname = usePathname();
  const pendingCount = usePendingOrderCount();

  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <Text style={styles.brandTitle}>Ody</Text>
        <Text style={styles.brandSubtitle}>Restaurant ops</Text>
      </View>
      <View style={styles.nav}>
        {TAB_ROUTES.map((route) => (
          <NavItem
            key={route.href}
            route={route}
            pathname={pathname}
            layout="sidebar"
            badgeCount={route.showPendingBadge ? pendingCount : 0}
          />
        ))}
      </View>
    </View>
  );
}
