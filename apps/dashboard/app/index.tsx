import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button, Card, useTheme } from "../src/design-system";
import { formatBrandId } from "@ody/shared";

export default function HomeScreen() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing[6],
      backgroundColor: theme.semantic.background,
      gap: theme.spacing[4],
    },
    title: {
      fontSize: theme.typography.fontSize["2xl"],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.semantic.text,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      color: theme.semantic.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ody Dashboard</Text>
      <Text style={styles.subtitle}>
        Workspace package: {formatBrandId("ody")}
      </Text>
      <Card variant="outlined">
        <Text style={styles.subtitle}>
          Phase 5 design system is ready. Explore tokens and primitives.
        </Text>
        <Link href="/menu" asChild>
          <Button label="Open Menu" />
        </Link>
        <Link href="/ui-library" asChild>
          <Button label="Open UI Library" variant="secondary" />
        </Link>
      </Card>
    </View>
  );
}
