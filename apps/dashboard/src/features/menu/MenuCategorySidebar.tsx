import type { MenuCategory, MenuItem } from "@ody/api-client";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Badge, Button, Skeleton, useTheme } from "../../design-system";

type MenuCategorySidebarProps = {
  categories: MenuCategory[];
  items: MenuItem[];
  selectedId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onAddCategory: () => void;
};

export function MenuCategorySidebar({
  categories,
  items,
  selectedId,
  loading,
  onSelect,
  onAddCategory,
}: MenuCategorySidebarProps) {
  const theme = useTheme();

  const countFor = (categoryId: string) =>
    items.filter((i) => i.categoryId === categoryId).length;

  return (
    <View
      style={{
        width: theme.layout.sidebarWidth,
        borderRightWidth: 1,
        borderRightColor: theme.semantic.border,
        backgroundColor: theme.semantic.surface,
        padding: theme.spacing[4],
        gap: theme.spacing[3],
      }}
    >
      <Text
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.semantic.text,
        }}
      >
        Categories
      </Text>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: theme.spacing[2] }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={44} />)
          : categories.map((category) => {
              const selected = category.id === selectedId;
              return (
                <Pressable
                  key={category.id}
                  onPress={() => onSelect(category.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: theme.spacing[3],
                    borderRadius: theme.radii.md,
                    backgroundColor: selected
                      ? theme.semantic.primaryMuted
                      : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: theme.semantic.text,
                      fontWeight: selected
                        ? theme.typography.fontWeight.semibold
                        : theme.typography.fontWeight.regular,
                    }}
                  >
                    {category.name}
                  </Text>
                  <Badge label={String(countFor(category.id))} variant="neutral" />
                </Pressable>
              );
            })}
      </ScrollView>
      <Button label="Add category" variant="secondary" fullWidth onPress={onAddCategory} />
    </View>
  );
}
