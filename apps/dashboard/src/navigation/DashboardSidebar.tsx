import { Ionicons } from "@expo/vector-icons";
import { useGetSettings } from "@ody/api-client";
import { usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { useTheme } from "../design-system/theme";
import { layout } from "../design-system/tokens";
import { NavItem } from "./NavItem";
import { SidebarUiLibraryLink } from "./SidebarUiLibraryLink";
import { TAB_ROUTES } from "./routes";
import { sidebarTransitionStyle } from "./sidebarTransitionStyle";
import { usePendingOrderCount } from "./usePendingOrderCount";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

function createSidebarStyles(t: Theme) {
  return {
    sidebar: {
      borderRightWidth: 1,
      borderRightColor: t.semantic.border,
      backgroundColor: t.semantic.surface,
      paddingVertical: t.spacing[5],
      gap: t.spacing[2],
      flexDirection: "column" as const,
      overflow: "hidden" as const,
    },
    sidebarExpanded: {
      paddingHorizontal: t.spacing[3],
    },
    sidebarCollapsed: {
      paddingHorizontal: t.spacing[2],
      alignItems: "center" as const,
    },
    brand: {
      paddingHorizontal: t.spacing[3],
      paddingBottom: t.spacing[4],
      gap: t.spacing[1],
    },
    brandCollapsed: {
      paddingHorizontal: 0,
      paddingBottom: t.spacing[4],
      alignItems: "center" as const,
    },
    brandDot: {
      width: t.spacing[2],
      height: t.spacing[2],
      borderRadius: t.radii.full,
      backgroundColor: t.semantic.primary,
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
    brandTextWrap: {
      gap: t.spacing[1],
    },
    nav: { flex: 1, gap: t.spacing[1], width: "100%" as const },
    toggleButton: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: t.spacing[2],
      borderRadius: t.radii.md,
    },
    toggleButtonCollapsed: {
      width: layout.sidebarCollapsedWidth - t.spacing[4],
    },
    footerDivider: {
      height: 1,
      backgroundColor: t.semantic.border,
      marginVertical: t.spacing[2],
      width: "100%" as const,
    },
    footer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: t.spacing[2],
      paddingHorizontal: t.spacing[3],
      paddingBottom: t.spacing[2],
    },
    footerCollapsed: {
      justifyContent: "center" as const,
      paddingHorizontal: 0,
    },
    statusDot: {
      width: t.spacing[2],
      height: t.spacing[2],
      borderRadius: t.radii.full,
    },
    footerLabel: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.textMuted,
    },
    footerLabelWrap: {
      opacity: 1,
    },
    footerLabelWrapCollapsed: {
      opacity: 0,
      width: 0,
      overflow: "hidden" as const,
    },
  };
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const theme = useTheme();
  const styles = useStyles(createSidebarStyles);
  const pathname = usePathname();
  const pendingCount = usePendingOrderCount();
  const settingsQuery = useGetSettings();
  const serviceAvailable =
    settingsQuery.data?.status === 200 ? settingsQuery.data.data.serviceAvailable : null;

  const statusLabel =
    serviceAvailable === null ? "…" : serviceAvailable ? "Open" : "Closed";
  const statusDotColor =
    serviceAvailable === null
      ? theme.semantic.textSubtle
      : serviceAvailable
        ? theme.semantic.success
        : theme.semantic.error;

  const sidebarWidth = collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

  return (
    <View
      style={[
        styles.sidebar,
        collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded,
        {
          width: sidebarWidth,
          alignSelf: "stretch",
          minHeight: "100%",
        },
        sidebarTransitionStyle("width"),
      ]}
    >
      <View style={[styles.brand, collapsed && styles.brandCollapsed]}>
        {collapsed ? (
          <View style={styles.brandDot} />
        ) : (
          <View style={[styles.brandTextWrap, sidebarTransitionStyle("opacity")]}>
            <Text style={styles.brandTitle}>Ody</Text>
            <Text style={styles.brandSubtitle}>Restaurant ops</Text>
          </View>
        )}
      </View>

      <View style={[styles.nav, collapsed && { alignItems: "center" as const }]}>
        {TAB_ROUTES.map((route) => (
          <NavItem
            key={route.href}
            route={route}
            pathname={pathname}
            layout="sidebar"
            collapsed={collapsed}
            badgeCount={route.showPendingBadge ? pendingCount : 0}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onPress={onToggle}
        style={({ pressed, hovered }) => [
          styles.toggleButton,
          collapsed && styles.toggleButtonCollapsed,
          (pressed || hovered) && { backgroundColor: theme.semantic.surfaceMuted },
        ]}
      >
        <Ionicons
          name={collapsed ? "chevron-forward-outline" : "chevron-back-outline"}
          size={18}
          color={theme.semantic.textMuted}
        />
      </Pressable>

      <View style={styles.footerDivider} />
      <View style={[styles.footer, collapsed && styles.footerCollapsed]}>
        <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
        <View
          style={[
            styles.footerLabelWrap,
            collapsed && styles.footerLabelWrapCollapsed,
            sidebarTransitionStyle("opacity"),
          ]}
        >
          <Text style={styles.footerLabel}>Service: {statusLabel}</Text>
        </View>
      </View>
      <SidebarUiLibraryLink collapsed={collapsed} />
    </View>
  );
}
