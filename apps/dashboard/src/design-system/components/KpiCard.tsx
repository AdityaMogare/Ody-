import { Text, View } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export type KpiCardProps = {
  label: string;
  value: string;
  loading?: boolean;
  error?: string | null;
};

function createKpiCardStyles(t: Theme) {
  return {
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
      color: t.semantic.textMuted,
    },
    value: {
      fontSize: t.typography.fontSize["2xl"],
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
    },
    error: {
      fontSize: t.typography.fontSize.sm,
      color: t.semantic.error,
    },
    body: { gap: t.spacing[2], minHeight: 36 },
  };
}

export function KpiCard({ label, value, loading = false, error = null }: KpiCardProps) {
  const styles = useStyles(createKpiCardStyles);

  return (
    <Card variant="outlined" style={{ flex: 1, minWidth: 160 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.body}>
        {loading ? (
          <Skeleton height={32} width="55%" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </Card>
  );
}
