import { Text } from "react-native";

import { Card, Input, useTheme } from "../../design-system";
import type { SettingsFormState } from "./settings-form";

type GeneralSettingsCardProps = {
  form: SettingsFormState;
  setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
};

export function GeneralSettingsCard({ form, setField }: GeneralSettingsCardProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ gap: theme.spacing[3] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.semantic.text,
        }}
      >
        General
      </Text>
      <Input
        label="Restaurant name"
        value={form.restaurantName}
        onChangeText={(value) => setField("restaurantName", value)}
      />
      <Input
        label="Prep time (minutes)"
        value={form.prepTimeMinutes}
        onChangeText={(value) => setField("prepTimeMinutes", value.replace(/[^\d]/g, ""))}
        keyboardType="number-pad"
        helperText="Between 1 and 120 minutes"
      />
    </Card>
  );
}
