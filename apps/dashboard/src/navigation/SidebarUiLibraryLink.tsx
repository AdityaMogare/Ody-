import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useStyles } from "../design-system/createStyles";
import type { Theme } from "../design-system/theme";
import { useTheme } from "../design-system/theme";
import { sidebarTransitionStyle } from "./sidebarTransitionStyle";

type SidebarUiLibraryLinkProps = {
  collapsed: boolean;
};

function createLinkStyles(t: Theme) {
  return {
    pressable: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: t.spacing[2],
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[2],
      borderRadius: t.radii.md,
    },
    pressableCollapsed: {
      justifyContent: "center" as const,
      paddingHorizontal: t.spacing[2],
    },
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
      color: t.semantic.textMuted,
    },
    labelActive: {
      color: t.semantic.primary,
    },
    labelWrap: {
      opacity: 1,
    },
    labelWrapCollapsed: {
      opacity: 0,
      width: 0,
      overflow: "hidden" as const,
    },
  };
}

export function SidebarUiLibraryLink({ collapsed }: SidebarUiLibraryLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const styles = useStyles(createLinkStyles);
  const active = pathname === "/ui-library" || pathname.startsWith("/ui-library/");

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel="UI Library"
      onPress={() => router.push("/ui-library")}
      style={({ pressed, hovered }) => [
        styles.pressable,
        collapsed && styles.pressableCollapsed,
        active && { backgroundColor: theme.semantic.primaryMuted },
        (pressed || hovered) && !active && { backgroundColor: theme.semantic.surfaceMuted },
      ]}
    >
      <Ionicons
        name={active ? "color-palette" : "color-palette-outline"}
        size={20}
        color={active ? theme.semantic.primary : theme.semantic.textMuted}
      />
      {!collapsed ? (
        <View style={[styles.labelWrap, sidebarTransitionStyle("opacity")]}>
          <Text style={[styles.label, active && styles.labelActive]}>UI Library</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
