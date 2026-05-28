import type { MenuItem } from "@ody/api-client";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import {
  Badge,
  Card,
  Toggle,
  useTheme,
} from "../../design-system";
import { formatPriceCents } from "../../lib/menu";

type MenuItemCardProps = {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: (available: boolean) => void;
  toggling?: boolean;
};

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailable,
  toggling,
}: MenuItemCardProps) {
  const theme = useTheme();

  return (
    <Card variant="outlined" style={{ flex: 1, minWidth: 260, maxWidth: 360 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing[2] }}>
        <View style={{ flex: 1, gap: theme.spacing[1] }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.semantic.text,
            }}
          >
            {item.name}
          </Text>
          {item.description ? (
            <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: "row", gap: theme.spacing[1] }}>
          <Pressable accessibilityLabel="Edit item" onPress={onEdit} hitSlop={8}>
            <Ionicons name="pencil" size={20} color={theme.semantic.textMuted} />
          </Pressable>
          <Pressable accessibilityLabel="Delete item" onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={theme.semantic.error} />
          </Pressable>
        </View>
      </View>
      <Text
        style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.semantic.text,
        }}
      >
        {formatPriceCents(item.priceCents)}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Badge
          label={item.available ? "Available" : "Unavailable"}
          variant={item.available ? "success" : "neutral"}
        />
        <Toggle
          label="Available"
          value={item.available}
          disabled={toggling}
          onValueChange={onToggleAvailable}
        />
      </View>
    </Card>
  );
}
