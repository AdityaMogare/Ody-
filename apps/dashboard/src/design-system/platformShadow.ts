import { Platform, type ViewStyle } from "react-native";

import type { Theme } from "./theme";

type ShadowLevel = keyof Theme["shadows"];

/** RN-web cannot apply native shadow* and boxShadow together on web. */
export function platformShadow(level: ShadowLevel, theme: Theme): ViewStyle {
  const shadow = theme.shadows[level];
  if (Platform.OS === "web") {
    return { boxShadow: shadow.boxShadow };
  }
  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  };
}
