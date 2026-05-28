import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useStyles } from "../createStyles";
import { platformShadow } from "../platformShadow";
import type { Theme } from "../theme";
import { kpiAccents } from "../tokens";
import { Skeleton } from "./Skeleton";

export type KpiAccent = keyof typeof kpiAccents;

export type KpiCardProps = {
  label: string;
  value: string;
  accent: KpiAccent;
  icon: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  error?: string | null;
};

function createKpiCardStyles(t: Theme) {
  return {
    card: {
      flex: 1,
      minWidth: 0,
      backgroundColor: t.semantic.surface,
      borderRadius: t.radii.lg,
      borderWidth: 1,
      borderColor: t.semantic.border,
      padding: t.spacing[5],
      gap: t.spacing[3],
      overflow: "hidden" as const,
      ...platformShadow("sm", t),
    },
    labelRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: t.spacing[2],
    },
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
      color: t.semantic.textMuted,
      flex: 1,
    },
    value: {
      fontSize: t.typography.kpiValue,
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
      lineHeight: t.typography.kpiValue * t.typography.lineHeight.tight,
    },
    valueSmall: {
      fontSize: t.typography.fontSize.xl,
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
    },
    error: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.error,
    },
    body: { minHeight: 40, justifyContent: "center" as const },
  };
}

export function KpiCard({
  label,
  value,
  accent,
  icon,
  loading = false,
  error = null,
}: KpiCardProps) {
  const styles = useStyles(createKpiCardStyles);
  const accentColor = kpiAccents[accent];
  const isLongValue = value.length > 14;

  return (
    <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: accentColor }]}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={18} color={accentColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.body}>
        {loading ? (
          <Skeleton height={36} width="55%" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={isLongValue ? styles.valueSmall : styles.value} numberOfLines={2}>
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}
