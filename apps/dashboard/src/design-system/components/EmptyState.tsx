import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type EmptyStateProps = {
  title: string;
  message?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function createEmptyStateStyles(t: Theme) {
  return {
    container: {
      alignItems: "center" as const,
      justifyContent: "center" as const,
      padding: t.spacing[6],
      gap: t.spacing[2],
    },
    title: {
      fontSize: t.typography.fontSize.lg,
      fontWeight: t.typography.fontWeight.semibold,
      color: t.semantic.text,
      textAlign: "center" as const,
    },
    message: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.textMuted,
      textAlign: "center" as const,
      maxWidth: 360,
    },
    action: { marginTop: t.spacing[2] },
  };
}

export function EmptyState({ title, message, action, style }: EmptyStateProps) {
  const styles = useStyles(createEmptyStateStyles);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}
