import { Text, View } from "react-native";

import { Card, EmptyState, Skeleton, useTheme } from "../../design-system";
import { chartAccents } from "../../design-system/tokens";
import type { TopMenuItemRow } from "../../hooks/useHomeStats";

type TopMenuItemsSectionProps = {
  items: TopMenuItemRow[];
  loading: boolean;
  error: string | null;
};

const BAR_HEIGHT = 8;

export function TopMenuItemsSection({ items, loading, error }: TopMenuItemsSectionProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ flex: 1, minWidth: 0, gap: theme.spacing[4] }}>
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
        <View style={{ gap: theme.spacing[3] }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={36} />
          ))}
        </View>
      ) : error ? (
        <Text style={{ color: theme.semantic.error, fontSize: theme.typography.fontSize.sm }}>
          {error}
        </Text>
      ) : items.length === 0 ? (
        <EmptyState title="No menu data" message="Menu item popularity will show once orders exist." />
      ) : (
        <View style={{ gap: theme.spacing[4] }}>
          {items.map((item, index) => (
            <View
              key={item.menuItemId}
              style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}
            >
              <Text
                style={{
                  width: 20,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.semantic.textSubtle,
                  textAlign: "center",
                }}
              >
                {index + 1}
              </Text>
              <View style={{ flex: 1, gap: theme.spacing[2], minWidth: 0 }}>
                <Text
                  style={{
                    color: theme.semantic.text,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View
                  style={{
                    height: BAR_HEIGHT,
                    borderRadius: theme.radii.full,
                    backgroundColor: theme.semantic.surfaceMuted,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${Math.max(Math.round(item.barFraction * 100), 4)}%`,
                      backgroundColor: chartAccents.menuBar,
                      borderRadius: theme.radii.full,
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  minWidth: 28,
                  textAlign: "right",
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.semantic.textMuted,
                }}
              >
                {item.orderCount}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
