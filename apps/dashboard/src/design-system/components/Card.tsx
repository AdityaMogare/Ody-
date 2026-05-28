import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type CardVariant = "elevated" | "outlined" | "muted";

export type CardProps = ViewProps & {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
};

function createCardStyles(t: Theme) {
  return {
    base: {
      borderRadius: t.radii.lg,
      padding: t.spacing[4],
      gap: t.spacing[3],
    },
    elevated: {
      backgroundColor: t.semantic.surface,
      ...t.shadows.md,
    },
    outlined: {
      backgroundColor: t.semantic.surface,
      borderWidth: 1,
      borderColor: t.semantic.border,
    },
    muted: {
      backgroundColor: t.semantic.surfaceMuted,
      borderWidth: 1,
      borderColor: t.semantic.border,
    },
  };
}

export function Card({
  variant = "elevated",
  style,
  children,
  ...viewProps
}: CardProps) {
  const styles = useStyles(createCardStyles);

  return (
    <View style={[styles.base, styles[variant], style]} {...viewProps}>
      {children}
    </View>
  );
}
