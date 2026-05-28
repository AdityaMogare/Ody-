import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Input,
  Modal,
  Select,
  Skeleton,
  SkeletonText,
  Toggle,
  useTheme,
  useToast,
} from "../../design-system";
import { LibrarySection, Note, Row, Subsection } from "./libraryLayout";

type DemoRow = { id: string; item: string; qty: number; total: string };

const TABLE_ROWS: DemoRow[] = [
  { id: "1", item: "Classic Burger", qty: 2, total: "$31.98" },
  { id: "2", item: "Margherita Pizza", qty: 1, total: "$13.99" },
  { id: "3", item: "House Iced Tea", qty: 3, total: "$13.47" },
];

export function ComponentsSection() {
  const theme = useTheme();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | undefined>("mains");
  const [toggleOn, setToggleOn] = useState(true);

  return (
    <LibrarySection
      title="Components"
      description="Every design-system primitive in default, variant, and state configurations."
    >
      <Subsection title="Button">
        <Note>Hover states apply on web via Pressable — interact to preview.</Note>
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Variants
        </Text>
        <Row>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Danger" variant="danger" />
        </Row>
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Sizes
        </Text>
        <Row>
          <Button label="Small" size="sm" />
          <Button label="Medium" size="md" />
          <Button label="Large" size="lg" />
        </Row>
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          States
        </Text>
        <Row>
          <Button label="Loading" loading />
          <Button label="Disabled" disabled />
        </Row>
      </Subsection>

      <Subsection title="Badge">
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Order statuses
        </Text>
        <Row>
          <Badge label="Pending" variant="warning" />
          <Badge label="Accepted" variant="info" />
          <Badge label="Preparing" variant="info" />
          <Badge label="Ready" variant="success" />
          <Badge label="Completed" variant="success" />
          <Badge label="Cancelled" variant="error" />
        </Row>
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Semantic variants
        </Text>
        <Row>
          <Badge label="Neutral" variant="neutral" />
          <Badge label="Success" variant="success" />
          <Badge label="Warning" variant="warning" />
          <Badge label="Danger" variant="error" />
          <Badge label="Info" variant="info" />
        </Row>
      </Subsection>

      <Subsection title="Input">
        <Input label="Default" placeholder="Guest name" />
        <Input
          label="With placeholder"
          placeholder="Search orders…"
          helperText="Focus ring uses semantic.primary on web"
        />
        <Input
          label="Error"
          defaultValue="bad-email"
          errorText="Enter a valid email address"
        />
        <Input label="Disabled" value="Read only value" editable={false} />
      </Subsection>

      <Subsection title="Select">
        <Select
          label="Default"
          placeholder="Choose category"
          options={[
            { label: "Starters", value: "starters" },
            { label: "Mains", value: "mains" },
            { label: "Drinks", value: "drinks" },
          ]}
          value={selectValue}
          onChange={setSelectValue}
        />
        <Select
          label="Disabled"
          options={[{ label: "Mains", value: "mains" }]}
          value="mains"
          disabled
          onChange={() => undefined}
        />
      </Subsection>

      <Subsection title="Toggle">
        <Toggle label="Notifications on" value={toggleOn} onValueChange={setToggleOn} />
        <Toggle label="Disabled off" value={false} disabled onValueChange={() => undefined} />
        <Toggle label="Disabled on" value={true} disabled onValueChange={() => undefined} />
      </Subsection>

      <Subsection title="Modal">
        <Button label="Open demo modal" onPress={() => setModalOpen(true)} />
        <Modal
          visible={modalOpen}
          title="Confirm action"
          onClose={() => setModalOpen(false)}
          footer={
            <Row>
              <Button label="Cancel" variant="secondary" onPress={() => setModalOpen(false)} />
              <Button label="Confirm" onPress={() => setModalOpen(false)} />
            </Row>
          }
        >
          <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
            Modals use semantic surfaces, radii, and spacing from tokens. Header, body, and footer
            slots are composable.
          </Text>
        </Modal>
      </Subsection>

      <Subsection title="Toast">
        <Row>
          <Button
            label="Success"
            variant="secondary"
            size="sm"
            onPress={() =>
              toast.show({
                title: "Order accepted",
                description: "Order moved to preparing.",
                variant: "success",
              })
            }
          />
          <Button
            label="Error"
            variant="secondary"
            size="sm"
            onPress={() =>
              toast.show({
                title: "Something failed",
                description: "Please try again.",
                variant: "error",
              })
            }
          />
          <Button
            label="Warning"
            variant="secondary"
            size="sm"
            onPress={() =>
              toast.show({
                title: "Low stock",
                description: "Classic Burger running low.",
                variant: "warning",
              })
            }
          />
          <Button
            label="Info"
            variant="secondary"
            size="sm"
            onPress={() =>
              toast.show({
                title: "Sync complete",
                description: "Menu updated from POS.",
                variant: "info",
              })
            }
          />
        </Row>
      </Subsection>

      <Subsection title="Skeleton">
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Text line
        </Text>
        <Skeleton height={14} width="60%" />
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Paragraph
        </Text>
        <SkeletonText lines={4} />
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Card block
        </Text>
        <Skeleton height={80} />
        <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
          Avatar + text
        </Text>
        <View style={{ flexDirection: "row", gap: theme.spacing[3], alignItems: "center" }}>
          <Skeleton height={40} width={40} borderRadius={theme.radii.full} />
          <View style={{ flex: 1, gap: theme.spacing[2] }}>
            <Skeleton height={14} width="40%" />
            <Skeleton height={12} width="70%" />
          </View>
        </View>
      </Subsection>

      <Subsection title="EmptyState">
        <Card variant="outlined">
          <View style={{ alignItems: "center", gap: theme.spacing[2] }}>
            <Ionicons name="receipt-outline" size={32} color={theme.semantic.textSubtle} />
            <EmptyState
              title="No orders yet"
              message="When customers place orders, they will appear here."
              action={<Button label="Refresh" variant="secondary" size="sm" />}
            />
          </View>
        </Card>
      </Subsection>

      <Subsection title="DataTable">
        <DataTable
          columns={[
            {
              key: "item",
              header: "Item",
              flex: 2,
              render: (r) => (
                <Text style={{ color: theme.semantic.text, fontSize: theme.typography.fontSize.sm }}>
                  {r.item}
                </Text>
              ),
            },
            {
              key: "qty",
              header: "Qty",
              flex: 0.6,
              render: (r) => (
                <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.sm }}>
                  {r.qty}
                </Text>
              ),
            },
            {
              key: "total",
              header: "Total",
              flex: 1,
              render: (r) => (
                <Text
                  style={{
                    color: theme.semantic.text,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {r.total}
                </Text>
              ),
            },
          ]}
          data={TABLE_ROWS}
          keyExtractor={(r) => r.id}
        />
        <Note>Rows highlight on hover (web). Column headers use uppercase muted labels.</Note>
      </Subsection>
    </LibrarySection>
  );
}
