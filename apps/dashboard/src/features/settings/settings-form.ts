import type { OpeningHours, RestaurantSettings, UpdateSettingsBody } from "@ody/api-client";

export const WEEKDAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;

export type WeekdayKey = (typeof WEEKDAYS)[number]["key"];

export type DayHoursForm = {
  enabled: boolean;
  open: string;
  close: string;
};

export type SettingsFormState = {
  restaurantName: string;
  prepTimeMinutes: string;
  autoAcceptOrders: boolean;
  serviceAvailable: boolean;
  openingHours: Record<WeekdayKey, DayHoursForm>;
};

function dayFromApi(value: { open: string; close: string } | null): DayHoursForm {
  if (!value) {
    return { enabled: false, open: "09:00", close: "17:00" };
  }
  return { enabled: true, open: value.open, close: value.close };
}

export function settingsToForm(settings: RestaurantSettings): SettingsFormState {
  return {
    restaurantName: settings.restaurantName,
    prepTimeMinutes: String(settings.prepTimeMinutes),
    autoAcceptOrders: settings.autoAcceptOrders,
    serviceAvailable: settings.serviceAvailable,
    openingHours: {
      mon: dayFromApi(settings.openingHours.mon),
      tue: dayFromApi(settings.openingHours.tue),
      wed: dayFromApi(settings.openingHours.wed),
      thu: dayFromApi(settings.openingHours.thu),
      fri: dayFromApi(settings.openingHours.fri),
      sat: dayFromApi(settings.openingHours.sat),
      sun: dayFromApi(settings.openingHours.sun),
    },
  };
}

export function formToUpdateBody(form: SettingsFormState): UpdateSettingsBody {
  const parsedPrep = Number.parseInt(form.prepTimeMinutes, 10);
  const prepTimeMinutes = Math.min(
    120,
    Math.max(1, Number.isFinite(parsedPrep) ? parsedPrep : 1),
  );

  const openingHours = WEEKDAYS.reduce((acc, { key }) => {
    const day = form.openingHours[key];
    acc[key] = day.enabled ? { open: day.open, close: day.close } : null;
    return acc;
  }, {} as OpeningHours);

  return {
    restaurantName: form.restaurantName.trim(),
    prepTimeMinutes,
    autoAcceptOrders: form.autoAcceptOrders,
    serviceAvailable: form.serviceAvailable,
    openingHours,
  };
}

export function formsEqual(a: SettingsFormState, b: SettingsFormState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
