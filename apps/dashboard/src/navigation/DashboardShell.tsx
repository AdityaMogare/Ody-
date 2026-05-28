import { Slot } from "expo-router";
import { Platform, View } from "react-native";

import { useTheme } from "../design-system/theme";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTabBar } from "./DashboardTabBar";
import { useSidebarState } from "./useSidebarState";

export function DashboardShell() {
  const theme = useTheme();
  const isWeb = Platform.OS === "web";
  const { collapsed, toggle } = useSidebarState();

  if (isWeb) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          minHeight: "100%",
          backgroundColor: theme.semantic.background,
        }}
      >
        <DashboardSidebar collapsed={collapsed} onToggle={toggle} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Slot />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.semantic.background }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <DashboardTabBar />
    </View>
  );
}
