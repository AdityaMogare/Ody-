import type { OpeningHours } from "./schema";

export const DEFAULT_OPENING_HOURS: OpeningHours = {
  mon: { open: "09:00", close: "21:00" },
  tue: { open: "09:00", close: "21:00" },
  wed: { open: "09:00", close: "21:00" },
  thu: { open: "09:00", close: "21:00" },
  fri: { open: "09:00", close: "22:00" },
  sat: { open: "10:00", close: "22:00" },
  sun: null,
};
