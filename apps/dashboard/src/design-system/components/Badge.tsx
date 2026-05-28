import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type BadgeVariant = "neutral" | "success" | "warning" | "error" | "info";

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

function createBadgeStyles(t: Theme) {
  return {
    base: {
      alignSelf: "flex-start" as const,
      paddingHorizontal: t.spacing[2],
      paddingVertical: t.spacing[1] / 2,
      borderRadius: t.radii.full,
    },
    label: {
      fontSize: t.typography.fontSize.xs,
      fontWeight: t.typography.fontWeight.semibold,
    },
    neutral: { backgroundColor: t.semantic.surfaceMuted },
    neutralLabel: { color: t.semantic.textMuted },
    success: { backgroundColor: t.semantic.successMuted },
    successLabel: { color: t.semantic.success },
    warning: { backgroundColor: t.semantic.warningMuted },
    warningLabel: { color: t.semantic.warning },
    error: { backgroundColor: t.semantic.errorMuted },
    errorLabel: { color: t.semantic.error },
    info: { backgroundColor: t.semantic.infoMuted },
    infoLabel: { color: t.semantic.info },
  };
}

export function Badge({ label, variant = "neutral", style }: BadgeProps) {
  const styles = useStyles(createBadgeStyles);
  const labelStyle = styles[`${variant}Label` as keyof typeof styles];

  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </View>
  );
}
