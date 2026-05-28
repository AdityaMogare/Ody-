import { Platform, type ViewStyle } from "react-native";

import { transitions } from "../design-system/tokens";

type TransitionProperty = "width" | "opacity";

/** CSS transitions for the collapsible sidebar (web only). */
export function sidebarTransitionStyle(property: TransitionProperty): ViewStyle {
  if (Platform.OS !== "web") {
    return {};
  }

  return {
    transitionProperty: property,
    transitionDuration: `${transitions.sidebar.durationMs}ms`,
    transitionTimingFunction: transitions.sidebar.easing,
  };
}
