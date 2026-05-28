import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Button, EmptyState, useTheme } from "../src/design-system";

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: theme.spacing[6],
          gap: theme.spacing[4],
          backgroundColor: theme.semantic.background,
        }}
      >
        <EmptyState
          title="Page not found"
          message="This route does not exist. Return to the dashboard home."
        />
        <Link href="/" asChild>
          <Button label="Go to Home" />
        </Link>
      </View>
    </>
  );
}
