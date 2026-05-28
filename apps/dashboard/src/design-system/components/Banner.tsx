import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type BannerVariant = "warning" | "info" | "error";

export type BannerProps = {
  message: string;
  variant?: BannerVariant;
  style?: StyleProp<ViewStyle>;
};

function createBannerStyles(t: Theme) {
  return {
    base: {
      padding: t.spacing[3],
      borderRadius: t.radii.md,
      borderWidth: 1,
    },
    text: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
    },
    warning: {
      backgroundColor: t.semantic.warningMuted,
      borderColor: t.semantic.warning,
    },
    warningText: { color: t.semantic.warning },
    info: {
      backgroundColor: t.semantic.infoMuted,
      borderColor: t.semantic.info,
    },
    infoText: { color: t.semantic.info },
    error: {
      backgroundColor: t.semantic.errorMuted,
      borderColor: t.semantic.error,
    },
    errorText: { color: t.semantic.error },
  };
}

export function Banner({ message, variant = "warning", style }: BannerProps) {
  const styles = useStyles(createBannerStyles);
  const variantStyle =
    variant === "info" ? styles.info : variant === "error" ? styles.error : styles.warning;
  const textStyle =
    variant === "info"
      ? styles.infoText
      : variant === "error"
        ? styles.errorText
        : styles.warningText;

  return (
    <View style={[styles.base, variantStyle, style]}>
      <Text style={[styles.text, textStyle]}>{message}</Text>
    </View>
  );
}
