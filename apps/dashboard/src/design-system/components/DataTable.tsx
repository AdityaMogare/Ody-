import {
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  flex?: number;
  width?: number;
  render: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingRows?: number;
  style?: StyleProp<ViewStyle>;
  onRowPress?: (row: T) => void;
  hoverable?: boolean;
};

function createTableStyles(t: Theme) {
  return {
    wrap: {
      width: "100%" as const,
      borderWidth: 1,
      borderColor: t.semantic.border,
      borderRadius: t.radii.lg,
      overflow: "hidden" as const,
      backgroundColor: t.semantic.surface,
    },
    headerRow: {
      flexDirection: "row" as const,
      backgroundColor: t.semantic.surfaceMuted,
      borderBottomWidth: 1,
      borderBottomColor: t.semantic.border,
    },
    headerCell: {
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[3],
      fontSize: t.typography.fontSize.xs,
      fontWeight: t.typography.fontWeight.semibold,
      color: t.semantic.textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: 0.4,
    },
    row: {
      flexDirection: "row" as const,
      borderBottomWidth: 1,
      borderBottomColor: t.semantic.border,
      alignItems: "center" as const,
    },
    rowHovered: {
      backgroundColor: t.semantic.surfaceMuted,
    },
    cell: {
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[3],
      justifyContent: "center" as const,
    },
    errorBox: {
      padding: t.spacing[4],
      backgroundColor: t.semantic.errorMuted,
    },
    errorText: { color: t.semantic.error, fontSize: t.typography.fontSize.sm },
    skeletonRow: {
      flexDirection: "row" as const,
      gap: t.spacing[2],
      padding: t.spacing[3],
    },
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  error = null,
  emptyTitle = "No data",
  emptyMessage = "There is nothing to show yet.",
  loadingRows = 4,
  style,
  onRowPress,
  hoverable = true,
}: DataTableProps<T>) {
  const styles = useStyles(createTableStyles);

  if (loading) {
    return (
      <View style={[styles.wrap, style]}>
        {Array.from({ length: loadingRows }).map((_, i) => (
          <View key={i} style={styles.skeletonRow}>
            {columns.map((col) => (
              <View key={col.key} style={{ flex: col.flex ?? 1, width: col.width }}>
                <Skeleton height={14} />
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.wrap, style]}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.wrap, style]}>
        <EmptyState title={emptyTitle} message={emptyMessage} />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <Text
            key={col.key}
            style={[styles.headerCell, { flex: col.flex ?? 1, width: col.width }]}
          >
            {col.header}
          </Text>
        ))}
      </View>
      <ScrollView>
        {data.map((row) => {
          const cells = columns.map((col) => (
            <View
              key={col.key}
              style={[styles.cell, { flex: col.flex ?? 1, width: col.width }]}
            >
              {col.render(row)}
            </View>
          ));

          const rowStyle = (state: { pressed: boolean; hovered?: boolean }) => [
            styles.row,
            hoverable && (state.pressed || state.hovered) && styles.rowHovered,
          ];

          if (onRowPress) {
            return (
              <Pressable
                key={keyExtractor(row)}
                onPress={() => onRowPress(row)}
                style={rowStyle}
              >
                {cells}
              </Pressable>
            );
          }

          return (
            <Pressable key={keyExtractor(row)} style={rowStyle}>
              {cells}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
