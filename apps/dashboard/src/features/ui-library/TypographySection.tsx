import { Text, View } from "react-native";

import { useTheme } from "../../design-system";
import { typography } from "../../design-system/tokens";
import { LibrarySection, Subsection } from "./libraryLayout";

const FONT_SIZES: Array<{
  token: keyof typeof typography.fontSize;
  usage: string;
}> = [
  { token: "xs", usage: "Captions, badges, table headers" },
  { token: "sm", usage: "Labels, helper text, secondary body" },
  { token: "md", usage: "Default body text" },
  { token: "lg", usage: "Section titles, sidebar labels" },
  { token: "xl", usage: "Page subheadings, drawer titles" },
  { token: "2xl", usage: "Page titles, KPI values (long)" },
  { token: "3xl", usage: "Hero headings" },
];

const FONT_WEIGHTS: Array<{
  token: keyof typeof typography.fontWeight;
  label: string;
}> = [
  { token: "regular", label: "Regular (400)" },
  { token: "medium", label: "Medium (500)" },
  { token: "semibold", label: "Semibold (600)" },
  { token: "bold", label: "Bold (700)" },
];

export function TypographySection() {
  const theme = useTheme();
  const sample = "The quick brown fox";

  return (
    <LibrarySection
      title="Typography"
      description="Font sizes and weights from tokens.typography — System sans for UI, Courier for monospace data."
    >
      <Subsection title="Font sizes">
        <View style={{ gap: theme.spacing[4] }}>
          {FONT_SIZES.map(({ token, usage }) => (
            <View key={token} style={{ gap: theme.spacing[1] }}>
              <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.semantic.textMuted }}>
                fontSize.{token} · {typography.fontSize[token]}px · {usage}
              </Text>
              <Text
                style={{
                  fontSize: typography.fontSize[token],
                  color: theme.semantic.text,
                  fontWeight: theme.typography.fontWeight.regular,
                }}
              >
                {sample}
              </Text>
            </View>
          ))}
          <View style={{ gap: theme.spacing[1] }}>
            <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.semantic.textMuted }}>
              typography.kpiValue · {typography.kpiValue}px · KPI metric numbers
            </Text>
            <Text
              style={{
                fontSize: typography.kpiValue,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.semantic.text,
              }}
            >
              1,248
            </Text>
          </View>
        </View>
      </Subsection>

      <Subsection title="Font weights">
        <View style={{ gap: theme.spacing[3] }}>
          {FONT_WEIGHTS.map(({ token, label }) => (
            <Text
              key={token}
              style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: typography.fontWeight[token],
                color: theme.semantic.text,
              }}
            >
              {label} — {sample}
            </Text>
          ))}
        </View>
      </Subsection>

      <Subsection title="Monospace">
        <Text
          style={{
            fontFamily: typography.fontFamily.mono,
            fontSize: theme.typography.fontSize.sm,
            color: theme.semantic.textMuted,
          }}
        >
          #a1b2c3d4 · order numbers, IDs
        </Text>
      </Subsection>
    </LibrarySection>
  );
}
