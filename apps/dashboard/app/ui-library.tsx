import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

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
  useTheme,
  useToast,
} from "../src/design-system";
import { colors, radii, spacing, typography } from "../src/design-system/tokens";

type DemoRow = { id: string; name: string; status: string };

const DEMO_ROWS: DemoRow[] = [
  { id: "1", name: "Order #1042", status: "Pending" },
  { id: "2", name: "Order #1041", status: "Ready" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Card variant="outlined" style={{ gap: theme.spacing[3] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.semantic.text,
        }}
      >
        {title}
      </Text>
      {children}
    </Card>
  );
}

function TokenSwatch({ name, value }: { name: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[2] }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: radii.sm,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: theme.semantic.border,
        }}
      />
      <Text style={{ color: theme.semantic.textMuted, fontSize: typography.fontSize.sm }}>
        {name}
      </Text>
    </View>
  );
}

export default function UiLibraryScreen() {
  const theme = useTheme();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState<string | undefined>();
  const [tableMode, setTableMode] = useState<"data" | "loading" | "empty" | "error">("data");

  const screenStyle = {
    flex: 1,
    backgroundColor: theme.semantic.background,
  };
  const contentStyle = {
    padding: theme.spacing[6],
    gap: theme.spacing[4],
    maxWidth: 960,
    width: "100%" as const,
    alignSelf: "center" as const,
  };
  const headingStyle = {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.semantic.text,
  };

  return (
    <ScrollView style={screenStyle} contentContainerStyle={contentStyle}>
      <Text style={headingStyle}>UI Library</Text>
      <Text style={{ color: theme.semantic.textMuted }}>
        Tokens and primitives — all styles derive from tokens.ts
      </Text>

      <Section title="Color tokens">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
          <TokenSwatch name="brand600" value={colors.brand600} />
          <TokenSwatch name="gray900" value={colors.gray900} />
          <TokenSwatch name="success500" value={colors.success500} />
          <TokenSwatch name="warning500" value={colors.warning500} />
          <TokenSwatch name="error500" value={colors.error500} />
          <TokenSwatch name="info500" value={colors.info500} />
        </View>
      </Section>

      <Section title="Typography & spacing">
        <Text style={{ fontSize: typography.fontSize.xs, color: theme.semantic.text }}>
          xs / {typography.fontSize.xs}px
        </Text>
        <Text style={{ fontSize: typography.fontSize.md, color: theme.semantic.text }}>
          md / {typography.fontSize.md}px
        </Text>
        <Text style={{ fontSize: typography.fontSize["2xl"], color: theme.semantic.text }}>
          2xl / {typography.fontSize["2xl"]}px
        </Text>
        <View style={{ flexDirection: "row", gap: spacing[2], marginTop: spacing[2] }}>
          {[1, 2, 4, 6, 8].map((s) => (
            <View
              key={s}
              style={{
                width: spacing[s as keyof typeof spacing],
                height: spacing[s as keyof typeof spacing],
                backgroundColor: theme.semantic.primary,
                borderRadius: radii.sm,
              }}
            />
          ))}
        </View>
      </Section>

      <Section title="Button">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] }}>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Danger" variant="danger" />
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] }}>
          <Button label="Small" size="sm" />
          <Button label="Medium" size="md" />
          <Button label="Large" size="lg" />
        </View>
        <Button label="Loading" loading />
        <Button label="Disabled" disabled />
      </Section>

      <Section title="Input">
        <Input label="Default" placeholder="Guest name" />
        <Input
          label="With error"
          defaultValue="bad@"
          errorText="Enter a valid email address"
        />
        <Input label="Disabled" value="Read only" editable={false} />
      </Section>

      <Section title="Select">
        <Select
          label="Category"
          placeholder="Choose category"
          options={[
            { label: "Starters", value: "starters" },
            { label: "Mains", value: "mains" },
            { label: "Drinks", value: "drinks" },
          ]}
          value={selectValue}
          onChange={setSelectValue}
        />
        <Select label="Loading" options={[]} loading onChange={() => undefined} />
        <Select
          label="Empty"
          options={[]}
          emptyMessage="No categories yet"
          onChange={() => undefined}
        />
        <Select
          label="Error"
          options={[{ label: "One", value: "one" }]}
          errorText="Failed to load options"
          onChange={() => undefined}
        />
      </Section>

      <Section title="Badge">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] }}>
          <Badge label="Neutral" variant="neutral" />
          <Badge label="Success" variant="success" />
          <Badge label="Warning" variant="warning" />
          <Badge label="Error" variant="error" />
          <Badge label="Info" variant="info" />
        </View>
      </Section>

      <Section title="Card variants">
        <Card variant="elevated">
          <Text style={{ color: theme.semantic.text }}>Elevated card</Text>
        </Card>
        <Card variant="outlined">
          <Text style={{ color: theme.semantic.text }}>Outlined card</Text>
        </Card>
        <Card variant="muted">
          <Text style={{ color: theme.semantic.text }}>Muted card</Text>
        </Card>
      </Section>

      <Section title="Skeleton">
        <Skeleton height={48} />
        <SkeletonText lines={3} />
      </Section>

      <Section title="Empty state">
        <EmptyState
          title="No orders yet"
          message="When customers place orders, they will appear here."
          action={<Button label="Refresh" variant="secondary" size="sm" />}
        />
      </Section>

      <Section title="DataTable states">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] }}>
          {(["data", "loading", "empty", "error"] as const).map((mode) => (
            <Button
              key={mode}
              label={mode}
              size="sm"
              variant={tableMode === mode ? "primary" : "secondary"}
              onPress={() => setTableMode(mode)}
            />
          ))}
        </View>
        <DataTable
          columns={[
            { key: "name", header: "Order", flex: 2, render: (r) => <Text>{r.name}</Text> },
            {
              key: "status",
              header: "Status",
              flex: 1,
              render: (r) => <Badge label={r.status} variant="info" />,
            },
          ]}
          data={tableMode === "data" ? DEMO_ROWS : []}
          keyExtractor={(r) => r.id}
          loading={tableMode === "loading"}
          error={tableMode === "error" ? "Could not load orders." : null}
          emptyTitle="No rows"
          emptyMessage="Switch to data mode to preview rows."
        />
      </Section>

      <Section title="Modal & Toast">
        <View style={{ flexDirection: "row", gap: theme.spacing[2], flexWrap: "wrap" }}>
          <Button label="Open modal" onPress={() => setModalOpen(true)} />
          <Button
            label="Success toast"
            variant="secondary"
            onPress={() =>
              toast.show({
                title: "Order accepted",
                description: "Order #1042 moved to preparing.",
                variant: "success",
              })
            }
          />
          <Button
            label="Error toast"
            variant="danger"
            onPress={() =>
              toast.show({
                title: "Something failed",
                description: "Please try again.",
                variant: "error",
              })
            }
          />
        </View>
        <Modal
          visible={modalOpen}
          title="Example modal"
          onClose={() => setModalOpen(false)}
          footer={
            <Button label="Confirm" onPress={() => setModalOpen(false)} />
          }
        >
          <Text style={{ color: theme.semantic.textMuted }}>
            Modals use theme surfaces, radii, and spacing from tokens.
          </Text>
        </Modal>
      </Section>
    </ScrollView>
  );
}
