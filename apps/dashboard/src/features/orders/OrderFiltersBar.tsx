import { GetOrdersStatus } from "@ody/api-client";
import { Text, View } from "react-native";

import { Input, Select, useTheme } from "../../design-system";
import type { OrderStatusFilter } from "../../hooks/useOrderFilters";

type OrderFiltersBarProps = {
  status: OrderStatusFilter;
  setStatus: (status: OrderStatusFilter) => void;
  search: string;
  setSearch: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
};

export function OrderFiltersBar(props: OrderFiltersBarProps) {
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
        Orders
      </Text>
      <View style={{ flexDirection: "row", gap: theme.spacing[2], flexWrap: "wrap" }}>
        <Select
          label="Status"
          options={[
            { label: "All", value: "all" },
            { label: "Pending", value: GetOrdersStatus.pending },
            { label: "Accepted", value: GetOrdersStatus.accepted },
            { label: "Preparing", value: GetOrdersStatus.preparing },
            { label: "Ready", value: GetOrdersStatus.ready },
            { label: "Completed", value: GetOrdersStatus.completed },
            { label: "Cancelled", value: GetOrdersStatus.cancelled },
          ]}
          value={props.status}
          onChange={props.setStatus}
          containerStyle={{ minWidth: 180 }}
        />
        <Input
          label="Search customer"
          placeholder="Type customer name"
          value={props.search}
          onChangeText={props.setSearch}
          containerStyle={{ minWidth: 220, flex: 1 }}
        />
        <Input
          label="From date"
          placeholder="YYYY-MM-DD"
          value={props.fromDate}
          onChangeText={props.setFromDate}
          containerStyle={{ minWidth: 140 }}
        />
        <Input
          label="To date"
          placeholder="YYYY-MM-DD"
          value={props.toDate}
          onChangeText={props.setToDate}
          containerStyle={{ minWidth: 140 }}
        />
      </View>
    </View>
  );
}
