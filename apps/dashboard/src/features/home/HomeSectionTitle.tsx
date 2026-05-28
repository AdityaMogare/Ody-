import { Text } from "react-native";

import { useTheme } from "../../design-system";

export function HomeSectionTitle({ title }: { title: string }) {
  const theme = useTheme();

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
