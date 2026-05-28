import { View } from "react-native";

import { useTheme } from "../../design-system";
import { NavItem } from "../../navigation/NavItem";
import { TAB_ROUTES } from "../../navigation/routes";
import { LibrarySection, Subsection } from "./libraryLayout";

export function NavigationSection() {
  const theme = useTheme();
  const ordersRoute = TAB_ROUTES.find((r) => r.href === "/orders")!;

  return (
    <LibrarySection
      title="Navigation elements"
      description="Sidebar NavItem in active and inactive states, including the pending-order badge pill."
    >
      <Subsection title="NavItem — inactive">
        <View
          style={{
            maxWidth: 260,
            padding: theme.spacing[2],
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.semantic.border,
            backgroundColor: theme.semantic.surface,
          }}
        >
          <NavItem route={TAB_ROUTES[0]!} pathname="/orders" layout="sidebar" badgeCount={0} />
        </View>
      </Subsection>

      <Subsection title="NavItem — active with badge">
        <View
          style={{
            maxWidth: 260,
            padding: theme.spacing[2],
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.semantic.border,
            backgroundColor: theme.semantic.surface,
          }}
        >
          <NavItem
            route={ordersRoute}
            pathname="/orders"
            layout="sidebar"
            badgeCount={8}
          />
        </View>
      </Subsection>

      <Subsection title="NavItem — collapsed (icon only)">
        <View
          style={{
            width: 56,
            padding: theme.spacing[2],
            borderRadius: theme.radii.lg,
            borderWidth: 1,
            borderColor: theme.semantic.border,
            backgroundColor: theme.semantic.surface,
            alignItems: "center",
          }}
        >
          <NavItem
            route={ordersRoute}
            pathname="/orders"
            layout="sidebar"
            collapsed
            badgeCount={8}
          />
        </View>
      </Subsection>
    </LibrarySection>
  );
}
