import { Text } from "react-native";

import type { Theme } from "../../design-system/theme";

export function DrawerSectionTitle({ title, theme }: { title: string; theme: Theme }) {
  return (
    <Text
      style={{
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.semantic.text,
      }}
    >
      {title}
    </Text>
  );
}
