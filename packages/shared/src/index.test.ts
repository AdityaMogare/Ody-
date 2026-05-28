import { describe, expect, it } from "vitest";
import { formatBrandId } from "./index";

describe("@ody/shared", () => {
  it("formatBrandId trims whitespace", () => {
    expect(formatBrandId("  abc  ")).toBe("abc");
  });
});
