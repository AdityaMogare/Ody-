import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  ErrorBoundary,
  ThemeProvider,
  ToastProvider,
} from "../src/design-system";
import { QueryProvider } from "../src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ToastProvider>
          <ErrorBoundary>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="index" options={{ title: "Ody Dashboard" }} />
              <Stack.Screen name="menu" options={{ title: "Menu" }} />
              <Stack.Screen name="orders" options={{ title: "Orders" }} />
              <Stack.Screen
                name="ui-library"
                options={{ title: "UI Library" }}
              />
            </Stack>
          </ErrorBoundary>
        </ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
