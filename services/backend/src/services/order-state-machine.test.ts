import { describe, expect, it } from "vitest";

import {
  allowedActions,
  getNextStatus,
  orderActions,
} from "./order-state-machine";

describe("order state machine", () => {
  it("defines all actions explicitly", () => {
    expect(orderActions).toEqual([
      "accept",
      "start_preparing",
      "mark_ready",
      "complete",
      "cancel",
    ]);
  });

  it("accepts pending -> accepted", () => {
    expect(getNextStatus("pending", "accept")).toBe("accepted");
  });

  it("rejects setting status directly via invalid action from completed", () => {
    expect(getNextStatus("completed", "accept")).toBeNull();
    expect(getNextStatus("completed", "cancel")).toBeNull();
    expect(allowedActions("completed")).toEqual([]);
  });

  it("allows cancel from active statuses only", () => {
    expect(getNextStatus("pending", "cancel")).toBe("cancelled");
    expect(getNextStatus("ready", "cancel")).toBe("cancelled");
    expect(getNextStatus("cancelled", "cancel")).toBeNull();
  });

  it("walks the happy path", () => {
    expect(getNextStatus("accepted", "start_preparing")).toBe("preparing");
    expect(getNextStatus("preparing", "mark_ready")).toBe("ready");
    expect(getNextStatus("ready", "complete")).toBe("completed");
  });

  it("lists allowed actions per status", () => {
    expect(allowedActions("pending")).toEqual(["accept", "cancel"]);
    expect(allowedActions("ready")).toEqual(["complete", "cancel"]);
  });
});
