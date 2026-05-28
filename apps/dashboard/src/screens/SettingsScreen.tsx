import { getGetSettingsQueryKey, useGetSettings, usePatchSettings } from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";

import { Button, EmptyState, useToast, useTheme } from "../design-system";
import { GeneralSettingsCard } from "../features/settings/GeneralSettingsCard";
import { OpeningHoursCard } from "../features/settings/OpeningHoursCard";
import { ServiceSettingsCard } from "../features/settings/ServiceSettingsCard";
import { SettingsScreenSkeleton } from "../features/settings/SettingsScreenSkeleton";
import { formToUpdateBody } from "../features/settings/settings-form";
import { useSettingsForm } from "../hooks/useSettingsForm";

export function SettingsScreen() {
  const theme = useTheme();
  const toast = useToast();
  const queryClient = useQueryClient();
  const settingsQuery = useGetSettings();
  const settings = settingsQuery.data?.status === 200 ? settingsQuery.data.data : undefined;
  const { form, setField, isDirty } = useSettingsForm(settings);

  const patchMutation = usePatchSettings({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 200) return;
        queryClient.setQueryData(getGetSettingsQueryKey(), res);
        toast.show({ title: "Settings saved", variant: "success" });
      },
      onError: () => toast.show({ title: "Failed to save settings", variant: "error" }),
    },
  });

  if (settingsQuery.isLoading || !form) {
    return <SettingsScreenSkeleton />;
  }

  if (settingsQuery.isError) {
    return (
      <View style={{ flex: 1, padding: theme.spacing[6], backgroundColor: theme.semantic.background }}>
        <EmptyState
          title="Could not load settings"
          message="Make sure the API is running and settings are seeded."
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.semantic.background }}
      contentContainerStyle={{ padding: theme.spacing[6], gap: theme.spacing[4] }}
    >
      <GeneralSettingsCard form={form} setField={setField} />
      <ServiceSettingsCard form={form} setField={setField} />
      <OpeningHoursCard form={form} setField={setField} />
      <Button
        label="Save changes"
        disabled={!isDirty}
        loading={patchMutation.isPending}
        onPress={() => patchMutation.mutate({ data: formToUpdateBody(form) })}
      />
    </ScrollView>
  );
}
