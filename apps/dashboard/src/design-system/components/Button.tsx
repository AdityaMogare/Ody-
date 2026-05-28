import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "style"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

function createButtonStyles(t: Theme) {
  return {
    base: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderRadius: t.radii.md,
      borderWidth: 1,
      gap: t.spacing[2],
    },
    sm: { paddingHorizontal: t.spacing[3], paddingVertical: t.spacing[1], minHeight: 32 },
    md: { paddingHorizontal: t.spacing[4], paddingVertical: t.spacing[2], minHeight: 40 },
    lg: { paddingHorizontal: t.spacing[5], paddingVertical: t.spacing[3], minHeight: 48 },
    fullWidth: { alignSelf: "stretch" as const },
    label: { fontWeight: t.typography.fontWeight.semibold },
    smLabel: { fontSize: t.typography.fontSize.sm },
    mdLabel: { fontSize: t.typography.fontSize.md },
    lgLabel: { fontSize: t.typography.fontSize.lg },
    primary: {
      backgroundColor: t.semantic.primary,
      borderColor: t.semantic.primary,
    },
    primaryLabel: { color: t.colors.white },
    secondary: {
      backgroundColor: t.semantic.surface,
      borderColor: t.semantic.borderStrong,
    },
    secondaryLabel: { color: t.semantic.text },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    ghostLabel: { color: t.semantic.primary },
    danger: {
      backgroundColor: t.semantic.error,
      borderColor: t.semantic.error,
    },
    dangerLabel: { color: t.colors.white },
    disabled: { opacity: 0.55 },
  };
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  fullWidth,
  style,
  ...pressable
}: ButtonProps) {
  const styles = useStyles(createButtonStyles);

  const isDisabled = disabled || loading;
  const labelStyle =
    variant === "primary"
      ? styles.primaryLabel
      : variant === "secondary"
        ? styles.secondaryLabel
        : variant === "ghost"
          ? styles.ghostLabel
          : styles.dangerLabel;

  const spinnerColor =
    variant === "secondary" || variant === "ghost"
      ? styles.secondaryLabel.color
      : styles.primaryLabel.color;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && { opacity: 0.9 },
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressable}
    >
      {loading ? <ActivityIndicator color={spinnerColor} size="small" /> : null}
      <Text style={[styles.label, styles[`${size}Label`], labelStyle]}>{label}</Text>
    </Pressable>
  );
}
