import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "react-native/Libraries/Utilities/useColorScheme":
        "react-native-web/dist/exports/useColorScheme",
    },
  },
});
