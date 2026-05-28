import type { RestaurantSettings } from "@ody/api-client";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  formsEqual,
  settingsToForm,
  type SettingsFormState,
} from "../features/settings/settings-form";

export function useSettingsForm(initialData: RestaurantSettings | undefined) {
  const [baseline, setBaseline] = useState<SettingsFormState | null>(null);
  const [form, setForm] = useState<SettingsFormState | null>(null);

  useEffect(() => {
    if (!initialData) return;
    const next = settingsToForm(initialData);
    setBaseline(next);
    setForm(next);
  }, [initialData]);

  const setField = useCallback(
    <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => {
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  const isDirty = useMemo(
    () => baseline !== null && form !== null && !formsEqual(baseline, form),
    [baseline, form],
  );

  const reset = useCallback(() => {
    if (baseline) setForm(baseline);
  }, [baseline]);

  return { form, setField, isDirty, reset };
}
