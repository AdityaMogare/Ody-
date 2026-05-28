import { Text, View } from "react-native";

import type { Theme } from "../../design-system/theme";

type DrawerStatProps = {
  label: string;
  value: string;
  theme: Theme;
};

export function DrawerStat({ label, value, theme }: DrawerStatProps) {
  return (
    <View
      style={{
        minWidth: 120,
        flex: 1,
        padding: theme.spacing[3],
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        backgroundColor: theme.semantic.surfaceMuted,
        gap: theme.spacing[1],
      }}
    >
      <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.xs }}>
        {label}
      </Text>
      <Text
        style={{
          color: theme.semantic.text,
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
