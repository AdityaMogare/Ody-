/**
 * Single source of truth for design values.
 * Components must reference tokens — never hardcode colors in UI files.
 */
export const colors = {
  white: "#ffffff",
  black: "#000000",

  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1e293b",
  gray900: "#0f172a",
  gray950: "#020617",

  brand50: "#eef2ff",
  brand100: "#e0e7ff",
  brand200: "#c7d2fe",
  brand500: "#6366f1",
  brand600: "#4f46e5",
  brand700: "#4338ca",

  success50: "#ecfdf5",
  success500: "#10b981",
  success700: "#047857",

  warning50: "#fffbeb",
  warning500: "#f59e0b",
  warning700: "#b45309",

  error50: "#fef2f2",
  error500: "#ef4444",
  error700: "#b91c1c",

  info50: "#eff6ff",
  info500: "#3b82f6",
  info700: "#1d4ed8",

  violet50: "#f5f3ff",
  violet500: "#8b5cf6",
  violet700: "#6d28d9",
} as const;

export const semanticColors = {
  background: colors.gray50,
  surface: colors.white,
  surfaceMuted: colors.gray100,
  border: colors.gray200,
  borderStrong: colors.gray300,
  text: colors.gray900,
  textMuted: colors.gray600,
  textSubtle: colors.gray500,
  primary: colors.brand600,
  primaryHover: colors.brand700,
  primaryMuted: colors.brand50,
  success: colors.success500,
  successMuted: colors.success50,
  warning: colors.warning500,
  warningMuted: colors.warning50,
  error: colors.error500,
  errorMuted: colors.error50,
  info: colors.info500,
  infoMuted: colors.info50,
  accentPurple: colors.violet500,
  accentPurpleMuted: colors.violet50,
  overlay: "rgba(15, 23, 42, 0.45)",
  focusRing: colors.brand200,
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: "System",
    mono: "Courier",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "3xl": 34,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
  },
  kpiValue: 32,
} as const;

/** Left-border accent colors for dashboard KPI cards */
export const kpiAccents = {
  orders: colors.info500,
  revenue: colors.success500,
  pending: colors.warning500,
  popular: colors.violet500,
} as const;

/** Bar fill for home dashboard charts */
export const chartAccents = {
  menuBar: colors.brand600,
} as const;

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    boxShadow: "none",
  },
  sm: {
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  },
  md: {
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
  },
  lg: {
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
  },
} as const;

export const layout = {
  maxContentWidth: 1200,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 56,
} as const;

export const transitions = {
  sidebar: {
    durationMs: 200,
    easing: "ease",
  },
} as const;

export const tokens = {
  colors,
  semantic: semanticColors,
  spacing,
  radii,
  typography,
  shadows,
  layout,
  kpiAccents,
  chartAccents,
  transitions,
} as const;

export type ThemeTokens = typeof tokens;
