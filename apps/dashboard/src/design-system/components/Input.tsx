import {
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type InputState = "default" | "error" | "disabled";

export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: InputState;
  containerStyle?: StyleProp<ViewStyle>;
};

function createInputStyles(t: Theme) {
  return {
    container: { gap: t.spacing[1] },
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
      color: t.semantic.text,
    },
    input: {
      borderWidth: 1,
      borderColor: t.semantic.borderStrong,
      borderRadius: t.radii.md,
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[2],
      fontSize: t.typography.fontSize.md,
      color: t.semantic.text,
      backgroundColor: t.semantic.surface,
      minHeight: 40,
    },
    inputFocused: {
      borderColor: t.semantic.primary,
    },
    inputError: {
      borderColor: t.semantic.error,
      backgroundColor: t.semantic.errorMuted,
    },
    inputDisabled: {
      backgroundColor: t.semantic.surfaceMuted,
      color: t.semantic.textSubtle,
    },
    helper: {
      fontSize: t.typography.fontSize.xs,
      color: t.semantic.textMuted,
    },
    error: {
      fontSize: t.typography.fontSize.xs,
      color: t.semantic.error,
    },
  };
}

export function Input({
  label,
  helperText,
  errorText,
  state,
  editable,
  containerStyle,
  style,
  ...inputProps
}: InputProps) {
  const styles = useStyles(createInputStyles);
  const resolvedState: InputState =
    state ?? (errorText ? "error" : editable === false ? "disabled" : "default");
  const isDisabled = resolvedState === "disabled";

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        editable={!isDisabled && editable !== false}
        placeholderTextColor={styles.helper.color}
        style={[
          styles.input,
          resolvedState === "error" && styles.inputError,
          isDisabled && styles.inputDisabled,
          style,
        ]}
        {...inputProps}
      />
      {errorText ? (
        <Text style={styles.error}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}
