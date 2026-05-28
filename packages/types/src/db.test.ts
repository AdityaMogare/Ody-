import { describe, expect, it } from "vitest";
import {
  insertMenuItemSchema,
  orderStatusEnum,
  selectOrderSchema,
} from "./db";

describe("@ody/types db exports", () => {
  it("re-exports order status enum values from backend schema", () => {
    expect(orderStatusEnum.enumValues).toContain("pending");
    expect(orderStatusEnum.enumValues).toContain("cancelled");
  });

  it("re-exports drizzle-zod insert schema with price in cents", () => {
    const parsed = insertMenuItemSchema.safeParse({
      categoryId: "00000000-0000-4000-8000-000000000001",
      name: "Burger",
      priceCents: 1299,
      available: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects negative price cents", () => {
    const parsed = insertMenuItemSchema.safeParse({
      categoryId: "00000000-0000-4000-8000-000000000001",
      name: "Burger",
      priceCents: -1,
      available: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("re-exports select order schema", () => {
    expect(selectOrderSchema.shape.status).toBeDefined();
  });
});
