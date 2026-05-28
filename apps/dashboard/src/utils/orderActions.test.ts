import { OrderActionBodyAction } from "@ody/api-client";
import { describe, expect, it } from "vitest";

import { getValidActions } from "./orderActions";

describe("getValidActions", () => {
  it("returns accept and cancel for pending", () => {
    const actions = getValidActions("pending").map((a) => a.action);
    expect(actions).toEqual([OrderActionBodyAction.accept, OrderActionBodyAction.cancel]);
  });

  it("returns start_preparing and cancel for accepted", () => {
    const actions = getValidActions("accepted").map((a) => a.action);
    expect(actions).toEqual([
      OrderActionBodyAction.start_preparing,
      OrderActionBodyAction.cancel,
    ]);
  });

  it("returns mark_ready for preparing", () => {
    const actions = getValidActions("preparing").map((a) => a.action);
    expect(actions).toEqual([OrderActionBodyAction.mark_ready]);
  });

  it("returns complete for ready", () => {
    const actions = getValidActions("ready").map((a) => a.action);
    expect(actions).toEqual([OrderActionBodyAction.complete]);
  });

  it("returns no actions for completed", () => {
    expect(getValidActions("completed")).toEqual([]);
  });

  it("returns no actions for cancelled", () => {
    expect(getValidActions("cancelled")).toEqual([]);
  });
});
