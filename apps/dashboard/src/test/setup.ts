import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("react-native/Libraries/Utilities/useColorScheme", () => ({
  default: () => "light",
}));

vi.mock("react-native", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Modal: ({ visible, children }: { visible?: boolean; children?: unknown }) =>
      visible ? children : null,
  };
});
