import { Text, View } from "react-native";

import { useTheme } from "../../design-system";

type LibrarySectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function LibrarySection({ title, description, children }: LibrarySectionProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <View style={{ gap: theme.spacing[1] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.semantic.text,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.semantic.textMuted }}>
          {description}
        </Text>
      </View>
      {children}
    </View>
  );
}

export function LibraryDivider() {
  const theme = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.semantic.border,
        marginVertical: theme.spacing[2],
      }}
    />
  );
}

export function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing[3] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.semantic.text,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export function TokenSwatch({ name, value }: { name: string; value: string }) {
  const theme = useTheme();

  return (
    <View style={{ width: 140, gap: theme.spacing[2] }}>
      <View
        style={{
          width: "100%",
          height: theme.spacing[10],
          borderRadius: theme.radii.md,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: theme.semantic.border,
        }}
      />
      <Text
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.semantic.text,
        }}
      >
        {name}
      </Text>
      <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.semantic.textMuted }}>
        {value}
      </Text>
    </View>
  );
}

export function SwatchGrid({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] }}>
      {children}
    </View>
  );
}

export function Note({ children }: { children: string }) {
  const theme = useTheme();

  return (
    <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.semantic.textSubtle }}>
      {children}
    </Text>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2], alignItems: "center" }}>
      {children}
    </View>
  );
}
