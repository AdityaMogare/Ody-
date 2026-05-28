import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithTheme } from "../../test/render";
import { Button } from "./Button";

describe("Button", () => {
  it("renders label correctly", () => {
    renderWithTheme(<Button label="Save order" onPress={vi.fn()} />);
    expect(screen.getByText("Save order")).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPress = vi.fn();
    renderWithTheme(<Button label="Tap me" onPress={onPress} />);
    await userEvent.click(screen.getByRole("button", { name: "Tap me" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = vi.fn();
    renderWithTheme(<Button label="Disabled" onPress={onPress} disabled />);
    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading indicator when loading and is not pressable", () => {
    const onPress = vi.fn();
    renderWithTheme(<Button label="Saving" onPress={onPress} loading />);
    expect(screen.getByRole("progressbar")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Saving" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "Saving" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
