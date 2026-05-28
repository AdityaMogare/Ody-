import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

export type SelectProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  loading?: boolean;
  errorText?: string;
  disabled?: boolean;
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

function createSelectStyles(t: Theme) {
  return {
    container: { gap: t.spacing[1] },
    label: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.medium,
      color: t.semantic.text,
    },
    trigger: {
      borderWidth: 1,
      borderColor: t.semantic.borderStrong,
      borderRadius: t.radii.md,
      paddingHorizontal: t.spacing[3],
      paddingVertical: t.spacing[2],
      backgroundColor: t.semantic.surface,
      minHeight: 40,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    triggerError: {
      borderColor: t.semantic.error,
      backgroundColor: t.semantic.errorMuted,
    },
    triggerDisabled: { opacity: 0.55 },
    value: { fontSize: t.typography.fontSize.md, color: t.semantic.text },
    placeholder: { fontSize: t.typography.fontSize.md, color: t.semantic.textSubtle },
    chevron: { color: t.semantic.textMuted, fontSize: t.typography.fontSize.sm },
    error: { fontSize: t.typography.fontSize.xs, color: t.semantic.error },
    modalBackdrop: {
      flex: 1,
      backgroundColor: t.semantic.overlay,
      justifyContent: "center" as const,
      padding: t.spacing[6],
    },
    modalCard: {
      backgroundColor: t.semantic.surface,
      borderRadius: t.radii.lg,
      maxHeight: 360,
      overflow: "hidden" as const,
    },
    option: {
      paddingHorizontal: t.spacing[4],
      paddingVertical: t.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: t.semantic.border,
    },
    optionSelected: { backgroundColor: t.semantic.primaryMuted },
    optionText: { fontSize: t.typography.fontSize.md, color: t.semantic.text },
    optionTextSelected: { fontWeight: t.typography.fontWeight.semibold },
  };
}

export function Select<T extends string = string>({
  label,
  placeholder = "Select…",
  options,
  value,
  onChange,
  loading = false,
  errorText,
  disabled,
  emptyMessage = "No options available",
  containerStyle,
}: SelectProps<T>) {
  const styles = useStyles(createSelectStyles);
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Skeleton height={40} />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          errorText && styles.triggerError,
          disabled && styles.triggerDisabled,
        ]}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {options.length === 0 ? (
              <EmptyState title="Nothing to select" message={emptyMessage} />
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.option, item.value === value && styles.optionSelected]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        item.value === value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
