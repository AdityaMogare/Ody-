import { Switch, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";

export type ToggleProps = {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

function createToggleStyles(t: Theme) {
  return {
    row: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: t.spacing[3],
    },
    label: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.text,
      fontWeight: t.typography.fontWeight.medium,
    },
  };
}

export function Toggle({
  label,
  value,
  onValueChange,
  disabled,
  style,
}: ToggleProps) {
  const styles = useStyles(createToggleStyles);

  return (
    <View style={[styles.row, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityRole="switch"
      />
    </View>
  );
}
