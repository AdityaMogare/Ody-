import { Text, View } from "react-native";

import { Card, useTheme } from "../../design-system";
import { platformShadow } from "../../design-system/platformShadow";
import { shadows } from "../../design-system/tokens";
import { LibrarySection, Subsection, SwatchGrid, TokenSwatch } from "./libraryLayout";

export function SurfacesSection() {
  const theme = useTheme();

  return (
    <LibrarySection
      title="Surfaces & elevation"
      description="Card variants, background surfaces, borders, and shadow tokens for depth."
    >
      <Subsection title="Card variants">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
          <Card variant="elevated" style={{ flex: 1, minWidth: 180 }}>
            <Text style={{ color: theme.semantic.text, fontWeight: theme.typography.fontWeight.semibold }}>
              Elevated
            </Text>
            <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
              Default raised surface with shadow
            </Text>
          </Card>
          <Card variant="outlined" style={{ flex: 1, minWidth: 180 }}>
            <Text style={{ color: theme.semantic.text, fontWeight: theme.typography.fontWeight.semibold }}>
              Outlined
            </Text>
            <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
              Border-only, flat surface
            </Text>
          </Card>
          <Card variant="muted" style={{ flex: 1, minWidth: 180 }}>
            <Text style={{ color: theme.semantic.text, fontWeight: theme.typography.fontWeight.semibold }}>
              Muted
            </Text>
            <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
              Subtle fill for grouped content
            </Text>
          </Card>
        </View>
      </Subsection>

      <Subsection title="Background surfaces">
        <SwatchGrid>
          <TokenSwatch name="semantic.background" value={theme.semantic.background} />
          <TokenSwatch name="semantic.surface" value={theme.semantic.surface} />
          <TokenSwatch name="semantic.surfaceMuted" value={theme.semantic.surfaceMuted} />
          <TokenSwatch name="semantic.primaryMuted" value={theme.semantic.primaryMuted} />
        </SwatchGrid>
      </Subsection>

      <Subsection title="Border variants">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
          <View
            style={{
              flex: 1,
              minWidth: 160,
              padding: theme.spacing[4],
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.semantic.border,
              backgroundColor: theme.semantic.surface,
            }}
          >
            <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
              border (default)
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: 160,
              padding: theme.spacing[4],
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.semantic.borderStrong,
              backgroundColor: theme.semantic.surface,
            }}
          >
            <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
              borderStrong
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              minWidth: 160,
              padding: theme.spacing[4],
              borderRadius: theme.radii.lg,
              borderWidth: 2,
              borderColor: theme.semantic.primary,
              backgroundColor: theme.semantic.surface,
            }}
          >
            <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
              primary (focus)
            </Text>
          </View>
        </View>
      </Subsection>

      <Subsection title="Shadow / elevation">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[4] }}>
          {(["sm", "md", "lg"] as const).map((level) => (
            <View
              key={level}
              style={{
                flex: 1,
                minWidth: 160,
                padding: theme.spacing[4],
                borderRadius: theme.radii.lg,
                backgroundColor: theme.semantic.surface,
                ...platformShadow(level, theme),
              }}
            >
              <Text style={{ color: theme.semantic.text, fontWeight: theme.typography.fontWeight.medium }}>
                shadows.{level}
              </Text>
              <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.xs }}>
                {shadows[level].boxShadow}
              </Text>
            </View>
          ))}
        </View>
      </Subsection>
    </LibrarySection>
  );
}
