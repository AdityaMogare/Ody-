import { Text, View } from "react-native";

import { Card, Input, Toggle, useTheme } from "../../design-system";
import { WEEKDAYS, type DayHoursForm, type SettingsFormState, type WeekdayKey } from "./settings-form";

type OpeningHoursCardProps = {
  form: SettingsFormState;
  setField: <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => void;
};

export function OpeningHoursCard({ form, setField }: OpeningHoursCardProps) {
  const theme = useTheme();

  const updateDay = (day: WeekdayKey, patch: Partial<DayHoursForm>) => {
    setField("openingHours", {
      ...form.openingHours,
      [day]: { ...form.openingHours[day], ...patch },
    });
  };

  return (
    <Card variant="outlined" style={{ gap: theme.spacing[3] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.semantic.text,
        }}
      >
        Opening hours
      </Text>
      {WEEKDAYS.map(({ key, label }) => {
        const day = form.openingHours[key];
        const inputState = day.enabled ? "default" : "disabled";

        return (
          <View
            key={key}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: theme.spacing[2],
            }}
          >
            <Text style={{ width: 96, color: theme.semantic.text }}>{label}</Text>
            <Toggle value={day.enabled} onValueChange={(enabled) => updateDay(key, { enabled })} />
            <Input
              label="Open"
              value={day.open}
              onChangeText={(open) => updateDay(key, { open })}
              state={inputState}
              containerStyle={{ flex: 1, minWidth: 100 }}
              placeholder="09:00"
            />
            <Input
              label="Close"
              value={day.close}
              onChangeText={(close) => updateDay(key, { close })}
              state={inputState}
              containerStyle={{ flex: 1, minWidth: 100 }}
              placeholder="21:00"
            />
          </View>
        );
      })}
    </Card>
  );
}
