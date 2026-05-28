import { ScrollView, Text, View } from "react-native";

import { useTheme } from "../../design-system";
import { ColorTokensSection } from "./ColorTokensSection";
import { ComponentsSection } from "./ComponentsSection";
import { LibraryDivider } from "./libraryLayout";
import { NavigationSection } from "./NavigationSection";
import { SpacingSection } from "./SpacingSection";
import { SurfacesSection } from "./SurfacesSection";
import { TypographySection } from "./TypographySection";

export function UiLibraryScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.semantic.background }}
      contentContainerStyle={{
        padding: theme.spacing[6],
        gap: theme.spacing[8],
        maxWidth: theme.layout.maxContentWidth,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <View style={{ gap: theme.spacing[2] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize["3xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.semantic.text,
          }}
        >
          UI Library
        </Text>
        <Text style={{ fontSize: theme.typography.fontSize.md, color: theme.semantic.textMuted }}>
          Design system reference — tokens, surfaces, and primitives used across the Ody
          dashboard. All values come from tokens.ts; components are imported from the design
          system.
        </Text>
      </View>

      <ColorTokensSection />
      <LibraryDivider />
      <TypographySection />
      <LibraryDivider />
      <SpacingSection />
      <LibraryDivider />
      <SurfacesSection />
      <LibraryDivider />
      <ComponentsSection />
      <LibraryDivider />
      <NavigationSection />
    </ScrollView>
  );
}
