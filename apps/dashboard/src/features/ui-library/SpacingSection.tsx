import { Text, View } from "react-native";

import { useTheme } from "../../design-system";
import { spacing } from "../../design-system/tokens";
import { LibrarySection } from "./libraryLayout";

const SPACING_KEYS = Object.keys(spacing)
  .map(Number)
  .sort((a, b) => a - b) as Array<keyof typeof spacing>;

export function SpacingSection() {
  const theme = useTheme();

  return (
    <LibrarySection
      title="Spacing scale"
      description="Consistent spacing rhythm from tokens.spacing — used for padding, gaps, and layout."
    >
      <View style={{ gap: theme.spacing[3] }}>
        {SPACING_KEYS.map((key) => {
          const px = spacing[key];
          return (
            <View
              key={key}
              style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}
            >
              <Text
                style={{
                  width: 100,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.semantic.textMuted,
                }}
              >
                spacing[{key}]
              </Text>
              <View
                style={{
                  width: px,
                  height: theme.spacing[3],
                  backgroundColor: theme.semantic.primary,
                  borderRadius: theme.radii.sm,
                  opacity: px === 0 ? 0 : 1,
                }}
              />
              <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.semantic.text }}>
                {px}px
              </Text>
            </View>
          );
        })}
      </View>
    </LibrarySection>
  );
}
