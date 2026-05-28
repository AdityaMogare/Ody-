import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { ThemeProvider } from "../design-system";

export function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider mode="light">{ui}</ThemeProvider>, options);
}
