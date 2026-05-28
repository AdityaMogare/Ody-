import { Text, View } from "react-native";

import { useTheme } from "../../design-system";
import { colors, kpiAccents, semanticColors } from "../../design-system/tokens";
import { LibrarySection, Subsection, SwatchGrid, TokenSwatch } from "./libraryLayout";

const PALETTE_GROUPS = [
  { title: "Gray scale", entries: Object.entries(colors).filter(([k]) => k.startsWith("gray")) },
  { title: "Brand / primary", entries: Object.entries(colors).filter(([k]) => k.startsWith("brand")) },
  { title: "Success", entries: Object.entries(colors).filter(([k]) => k.startsWith("success")) },
  { title: "Warning", entries: Object.entries(colors).filter(([k]) => k.startsWith("warning")) },
  { title: "Error / danger", entries: Object.entries(colors).filter(([k]) => k.startsWith("error")) },
  { title: "Info", entries: Object.entries(colors).filter(([k]) => k.startsWith("info")) },
  { title: "Accent violet", entries: Object.entries(colors).filter(([k]) => k.startsWith("violet")) },
  { title: "Base", entries: Object.entries(colors).filter(([k]) => k === "white" || k === "black") },
] as const;

const SEMANTIC_GROUPS = [
  {
    title: "Surfaces & backgrounds",
    keys: ["background", "surface", "surfaceMuted", "primaryMuted", "overlay"] as const,
  },
  {
    title: "Text",
    keys: ["text", "textMuted", "textSubtle"] as const,
  },
  {
    title: "Borders & focus",
    keys: ["border", "borderStrong", "focusRing"] as const,
  },
  {
    title: "Semantic palette",
    keys: [
      "primary",
      "primaryHover",
      "success",
      "successMuted",
      "warning",
      "warningMuted",
      "error",
      "errorMuted",
      "info",
      "infoMuted",
      "accentPurple",
      "accentPurpleMuted",
    ] as const,
  },
] as const;

export function ColorTokensSection() {
  const theme = useTheme();

  return (
    <LibrarySection
      title="Color tokens"
      description="Every color from tokens.ts — palette primitives and semantic aliases used across the dashboard."
    >
      {PALETTE_GROUPS.map((group) => (
        <Subsection key={group.title} title={group.title}>
          <SwatchGrid>
            {group.entries.map(([name, value]) => (
              <TokenSwatch key={name} name={name} value={value} />
            ))}
          </SwatchGrid>
        </Subsection>
      ))}

      {SEMANTIC_GROUPS.map((group) => (
        <Subsection key={group.title} title={`Semantic — ${group.title}`}>
          <SwatchGrid>
            {group.keys.map((key) => (
              <TokenSwatch key={key} name={`semantic.${key}`} value={semanticColors[key]} />
            ))}
          </SwatchGrid>
        </Subsection>
      ))}

      <Subsection title="KPI accents">
        <SwatchGrid>
          {Object.entries(kpiAccents).map(([name, value]) => (
            <TokenSwatch key={name} name={`kpiAccents.${name}`} value={value} />
          ))}
        </SwatchGrid>
      </Subsection>

      <View
        style={{
          padding: theme.spacing[3],
          borderRadius: theme.radii.md,
          backgroundColor: theme.semantic.surfaceMuted,
        }}
      >
        <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.semantic.textMuted }}>
          Components must reference semantic tokens or palette exports — never hardcode hex in UI
          files.
        </Text>
      </View>
    </LibrarySection>
  );
}
