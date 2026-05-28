import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { tokens, type ThemeTokens } from "./tokens";

export type ThemeMode = "light" | "dark";

export type SemanticColors = typeof tokens.semantic;

export type Theme = ThemeTokens & {
  mode: ThemeMode;
  semantic: SemanticColors;
};

const darkSemantic = {
  background: tokens.colors.gray950,
  surface: tokens.colors.gray900,
  surfaceMuted: tokens.colors.gray800,
  border: tokens.colors.gray700,
  borderStrong: tokens.colors.gray600,
  text: tokens.colors.gray50,
  textMuted: tokens.colors.gray300,
  textSubtle: tokens.colors.gray400,
  primary: tokens.colors.brand500,
  primaryHover: tokens.colors.brand200,
  primaryMuted: tokens.colors.gray800,
  success: tokens.colors.success500,
  successMuted: tokens.colors.gray800,
  warning: tokens.colors.warning500,
  warningMuted: tokens.colors.gray800,
  error: tokens.colors.error500,
  errorMuted: tokens.colors.gray800,
  info: tokens.colors.info500,
  infoMuted: tokens.colors.gray800,
  accentPurple: tokens.colors.violet500,
  accentPurpleMuted: tokens.colors.gray800,
  overlay: "rgba(0, 0, 0, 0.6)",
  focusRing: tokens.colors.brand700,
} as const;

function buildTheme(mode: ThemeMode): Theme {
  return {
    ...tokens,
    mode,
    semantic: (mode === "light" ? tokens.semantic : darkSemantic) as SemanticColors,
  };
}

const ThemeContext = createContext<Theme>(buildTheme("light"));

type ThemeProviderProps = {
  children: ReactNode;
  /** Force a mode; defaults to system preference with light fallback */
  mode?: ThemeMode;
};

export function ThemeProvider({ children, mode }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolvedMode: ThemeMode =
    mode ?? (systemScheme === "dark" ? "dark" : "light");

  const theme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function useThemeMode() {
  const theme = useTheme();
  return theme.mode;
}
