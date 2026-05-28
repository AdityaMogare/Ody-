import type { MenuItem } from "@ody/api-client";
import { ScrollView, Text, View } from "react-native";

import { Button, EmptyState, Skeleton, useTheme } from "../../design-system";
import { MenuItemCard } from "./MenuItemCard";

type MenuItemsPanelProps = {
  categoryName?: string;
  items: MenuItem[];
  loading?: boolean;
  error?: string | null;
  togglingId?: string | null;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onToggleAvailable: (item: MenuItem, available: boolean) => void;
};

export function MenuItemsPanel({
  categoryName,
  items,
  loading,
  error,
  togglingId,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailable,
}: MenuItemsPanelProps) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: theme.spacing[6], gap: theme.spacing[4] }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.semantic.text,
          }}
        >
          {categoryName ?? "Menu items"}
        </Text>
        <Button label="Add item" onPress={onAddItem} />
      </View>

      {loading ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={160} style={{ flex: 1, minWidth: 260 }} />
          ))}
        </View>
      ) : error ? (
        <EmptyState title="Could not load items" message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No items in this category"
          message="Add your first menu item to get started."
          action={<Button label="Add item" onPress={onAddItem} />}
        />
      ) : (
        <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              toggling={togglingId === item.id}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item)}
              onToggleAvailable={(available) => onToggleAvailable(item, available)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
