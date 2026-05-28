import { Text, View } from "react-native";

import { Input, useTheme } from "../../design-system";

type CustomerSearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function CustomerSearchBar({ search, onSearchChange }: CustomerSearchBarProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing[2] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.semantic.text,
        }}
      >
        CRM
      </Text>
      <Input
        label="Search customers"
        placeholder="Name or email"
        value={search}
        onChangeText={onSearchChange}
      />
    </View>
  );
}
