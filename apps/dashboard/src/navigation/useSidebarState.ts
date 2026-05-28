import { useCallback, useState } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "ody:dashboard:sidebar-collapsed";

function readCollapsedPreference(): boolean {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function persistCollapsedPreference(collapsed: boolean): void {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }
}

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      persistCollapsedPreference(next);
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
