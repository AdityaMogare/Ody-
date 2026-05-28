import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type TabHref = "/" | "/orders" | "/menu" | "/crm" | "/settings";

export type TabRoute = {
  href: TabHref;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  iconFocused: ComponentProps<typeof Ionicons>["name"];
  showPendingBadge?: boolean;
};

export const TAB_ROUTES: TabRoute[] = [
  {
    href: "/",
    label: "Home",
    icon: "home-outline",
    iconFocused: "home",
  },
  {
    href: "/orders",
    label: "Orders",
    icon: "receipt-outline",
    iconFocused: "receipt",
    showPendingBadge: true,
  },
  {
    href: "/menu",
    label: "Menu",
    icon: "restaurant-outline",
    iconFocused: "restaurant",
  },
  {
    href: "/crm",
    label: "CRM",
    icon: "people-outline",
    iconFocused: "people",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "settings-outline",
    iconFocused: "settings",
  },
];

export function isTabActive(pathname: string, href: TabHref): boolean {
  if (href === "/") {
    return pathname === "/" || pathname === "";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
