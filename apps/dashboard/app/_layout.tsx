import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "../src/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="ui-library"
          options={{ headerShown: true, title: "UI Library" }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Not found" }} />
      </Stack>
    </AppProviders>
  );
}
