import { Text, View } from "react-native";

import { Card, EmptyState, Skeleton, useTheme } from "../../design-system";
import type { TopMenuItemRow } from "../../hooks/useHomeStats";

type TopMenuItemsSectionProps = {
  items: TopMenuItemRow[];
  loading: boolean;
  error: string | null;
};

export function TopMenuItemsSection({ items, loading, error }: TopMenuItemsSectionProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ gap: theme.spacing[3] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.semantic.text,
        }}
      >
        Top menu items
      </Text>

      {loading ? (
        <View style={{ gap: theme.spacing[2] }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={28} />
          ))}
        </View>
      ) : error ? (
        <Text style={{ color: theme.semantic.error, fontSize: theme.typography.fontSize.sm }}>
          {error}
        </Text>
      ) : items.length === 0 ? (
        <EmptyState title="No menu data" message="Menu item popularity will show once orders exist." />
      ) : (
        <View style={{ gap: theme.spacing[3] }}>
          {items.map((item) => (
            <View key={item.menuItemId} style={{ gap: theme.spacing[1] }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.semantic.text, flex: 1 }} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.semantic.textMuted }}>{item.orderCount}</Text>
              </View>
              <View
                style={{
                  height: 8,
                  borderRadius: theme.radii.full,
                  backgroundColor: theme.semantic.surfaceMuted,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${Math.round(item.barFraction * 100)}%`,
                    backgroundColor: theme.semantic.primary,
                    borderRadius: theme.radii.full,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
