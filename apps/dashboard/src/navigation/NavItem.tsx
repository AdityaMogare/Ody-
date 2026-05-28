import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { useTheme } from "../design-system/theme";
import { isTabActive, type TabRoute } from "./routes";

type NavItemProps = {
  route: TabRoute;
  pathname: string;
  layout: "sidebar" | "tab";
  badgeCount?: number;
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
  };
}

export function NavItem({ route, pathname, layout, badgeCount = 0 }: NavItemProps) {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(createNavItemStyles);
  const active = isTabActive(pathname, route.href);
  const iconName = active ? route.iconFocused : route.icon;
  const iconColor = active ? theme.semantic.primary : theme.semantic.textMuted;
  const showBadge = route.showPendingBadge && badgeCount > 0;
  const badgeLabel = badgeCount > 99 ? "99+" : String(badgeCount);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => router.push(route.href)}
      style={[
        layout === "sidebar" ? styles.sidebarPressable : styles.tabPressable,
        active && styles.active,
      ]}
    >
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={layout === "sidebar" ? 22 : 24} color={iconColor} />
          {layout === "tab" && showBadge ? (
            <View style={styles.tabBadge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
          ) : null}
        </View>
        <Text
          style={[
            styles.label,
            layout === "sidebar" && styles.sidebarLabel,
            active ? styles.labelActive : styles.labelInactive,
          ]}
        >
          {route.label}
        </Text>
        {layout === "sidebar" && showBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        ) : null}
    </Pressable>
  );
}
