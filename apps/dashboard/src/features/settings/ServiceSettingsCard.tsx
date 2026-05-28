import { Text, View } from "react-native";

import { Banner, Card, Toggle, useTheme } from "../../design-system";
import type { SettingsFormState } from "./settings-form";

type ServiceSettingsCardProps = {
  form: SettingsFormState;
  setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
};

export function ServiceSettingsCard({ form, setField }: ServiceSettingsCardProps) {
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
        Service
      </Text>
      <Toggle
        label="Service available"
        value={form.serviceAvailable}
        onValueChange={(value) => setField("serviceAvailable", value)}
      />
      {!form.serviceAvailable ? (
        <Banner message="New orders will be rejected" variant="warning" />
      ) : null}
      <View style={{ height: 1, backgroundColor: theme.semantic.border }} />
      <Toggle
        label="Auto-accept orders"
        value={form.autoAcceptOrders}
        onValueChange={(value) => setField("autoAcceptOrders", value)}
      />
      {form.autoAcceptOrders ? (
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Orders skip pending and go straight to accepted.
        </Text>
      ) : null}
    </Card>
  );
}
