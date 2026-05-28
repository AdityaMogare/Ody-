import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { useTheme } from "../design-system/theme";
import { sidebarTransitionStyle } from "./sidebarTransitionStyle";
import { isTabActive, type TabRoute } from "./routes";

type NavItemProps = {
  route: TabRoute;
  pathname: string;
  layout: "sidebar" | "tab";
  badgeCount?: number;
  collapsed?: boolean;
};

function createNavItemStyles(t: Theme) {
  return {
    sidebarPressable: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: t.spacing[3],
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[2],
      borderRadius: t.radii.md,
    },
    sidebarCollapsedPressable: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: t.spacing[2],
      paddingVertical: t.spacing[2],
      borderRadius: t.radii.md,
    },
    tabPressable: {
      flex: 1,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: t.spacing[1],
      paddingVertical: t.spacing[2],
      borderRadius: t.radii.md,
      minHeight: 56,
    },
    active: {
      backgroundColor: t.semantic.primaryMuted,
    },
    labelWrap: {
      flex: 1,
      opacity: 1,
    },
    labelWrapCollapsed: {
      flex: 0,
      opacity: 0,
      maxWidth: 0,
      overflow: "hidden" as const,
    },
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
    },
    labelActive: {
      color: t.semantic.primary,
    },
    labelInactive: {
      color: t.semantic.textMuted,
    },
    sidebarLabel: {
      fontSize: t.typography.fontSize.md,
    },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: t.radii.full,
      backgroundColor: t.semantic.error,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: t.spacing[1],
    },
    badgeText: {
      color: t.colors.white,
      fontSize: t.typography.fontSize.xs,
      fontWeight: t.typography.fontWeight.bold,
    },
    iconWrap: {
      position: "relative" as const,
    },
    tabBadge: {
      position: "absolute" as const,
      top: -6,
      right: -10,
      minWidth: 18,
      height: 18,
      borderRadius: t.radii.full,
      backgroundColor: t.semantic.error,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: t.semantic.surface,
    },
    sidebarIconBadge: {
      position: "absolute" as const,
      top: -4,
      right: -6,
      minWidth: 16,
      height: 16,
      borderRadius: t.radii.full,
      backgroundColor: t.semantic.error,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: 3,
      borderWidth: 2,
      borderColor: t.semantic.surface,
    },
    itemWrap: {
      position: "relative" as const,
    },
    tooltip: {
      position: "absolute" as const,
      left: "100%" as const,
      top: "50%" as const,
      marginLeft: t.spacing[2],
      marginTop: -t.spacing[4],
      paddingHorizontal: t.spacing[2],
      paddingVertical: t.spacing[1],
      borderRadius: t.radii.sm,
      backgroundColor: t.semantic.text,
      zIndex: 100,
    },
    tooltipText: {
      color: t.colors.white,
      fontSize: t.typography.fontSize.xs,
      fontWeight: t.typography.fontWeight.medium,
    },
  };
}

export function NavItem({
  route,
  pathname,
  layout,
  badgeCount = 0,
  collapsed = false,
}: NavItemProps) {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(createNavItemStyles);
  const [hovered, setHovered] = useState(false);
  const active = isTabActive(pathname, route.href);
  const iconName = active ? route.iconFocused : route.icon;
  const iconColor = active ? theme.semantic.primary : theme.semantic.textMuted;
  const showBadge = route.showPendingBadge && badgeCount > 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);
  const isCollapsedSidebar = layout === "sidebar" && collapsed;
  const showTooltip = isCollapsedSidebar && hovered && Platform.OS === "web";

  return (
    <View style={styles.itemWrap}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={route.label}
        onPress={() => router.push(route.href)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={({ pressed, hovered }) => [
          layout === "sidebar"
            ? collapsed
              ? styles.sidebarCollapsedPressable
              : styles.sidebarPressable
            : styles.tabPressable,
          active && styles.active,
          (pressed || hovered) && layout === "sidebar" && { backgroundColor: theme.semantic.surfaceMuted },
        ]}
      >
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={layout === "sidebar" ? 22 : 24} color={iconColor} />
          {layout === "tab" && showBadge ? (
            <View style={styles.tabBadge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
          ) : null}
          {isCollapsedSidebar && showBadge ? (
            <View style={styles.sidebarIconBadge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
          ) : null}
        </View>
        {layout === "sidebar" ? (
          <View
            style={[
              styles.labelWrap,
              collapsed && styles.labelWrapCollapsed,
              sidebarTransitionStyle("opacity"),
            ]}
          >
            <Text
              style={[
                styles.label,
                styles.sidebarLabel,
                active ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
            >
              {route.label}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.label,
              active ? styles.labelActive : styles.labelInactive,
            ]}
          >
            {route.label}
          </Text>
        )}
        {layout === "sidebar" && !collapsed && showBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        ) : null}
      </Pressable>
      {showTooltip ? (
        <View style={styles.tooltip} pointerEvents="none">
          <Text style={styles.tooltipText}>{route.label}</Text>
        </View>
      ) : null}
    </View>
  );
}
