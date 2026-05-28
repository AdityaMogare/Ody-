import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithTheme } from "../../test/render";
import { semanticColors } from "../tokens";
import { Badge, type BadgeVariant } from "./Badge";

const ORDER_STATUS_BADGES: Array<{ status: string; variant: BadgeVariant }> = [
  { status: "pending", variant: "warning" },
  { status: "preparing", variant: "warning" },
  { status: "completed", variant: "success" },
  { status: "cancelled", variant: "error" },
];

function expectBadgeStyles(label: string, variant: BadgeVariant) {
  const text = screen.getByText(label);
  const container = text.parentElement;
  const variantStyles: Record<BadgeVariant, { color: string; backgroundColor: string }> = {
    neutral: { color: semanticColors.textMuted, backgroundColor: semanticColors.surfaceMuted },
    success: { color: semanticColors.success, backgroundColor: semanticColors.successMuted },
    warning: { color: semanticColors.warning, backgroundColor: semanticColors.warningMuted },
    error: { color: semanticColors.error, backgroundColor: semanticColors.errorMuted },
    info: { color: semanticColors.info, backgroundColor: semanticColors.infoMuted },
  };
  expect(text).toHaveStyle({ color: variantStyles[variant].color });
  expect(container).toHaveStyle({ backgroundColor: variantStyles[variant].backgroundColor });
}

describe("Badge", () => {
  it.each(ORDER_STATUS_BADGES)("renders $status label", ({ status, variant }) => {
    renderWithTheme(<Badge label={status} variant={variant} />);
    expect(screen.getByText(status)).toBeTruthy();
  });

  it.each(ORDER_STATUS_BADGES)("applies $variant styles for $status", ({ status, variant }) => {
    renderWithTheme(<Badge label={status} variant={variant} />);
    expectBadgeStyles(status, variant);
  });
});
