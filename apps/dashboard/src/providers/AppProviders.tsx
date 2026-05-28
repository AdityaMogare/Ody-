import type { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ErrorBoundary,
  ThemeProvider,
  ToastProvider,
} from "../design-system";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <ToastProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
