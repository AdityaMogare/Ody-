import type { OrderWithItems } from "@ody/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, ToastProvider } from "../design-system";
import { OrderDetailDrawer } from "./OrderDetailDrawer";

const mutateMock = vi.fn();

vi.mock("@ody/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@ody/api-client")>();
  return {
    ...actual,
    getGetOrdersQueryKey: vi.fn(() => ["/orders"]),
    useGetCustomersId: vi.fn(),
    useGetMenuItems: vi.fn(),
    usePostOrdersIdActions: vi.fn(),
  };
});

import {
  useGetCustomersId,
  useGetMenuItems,
  usePostOrdersIdActions,
} from "@ody/api-client";

function buildOrder(overrides: Partial<OrderWithItems> = {}): OrderWithItems {
  return {
    id: "order-1",
    customerId: "customer-1",
    status: "pending",
    subtotalCents: 2000,
    taxCents: 0,
    totalCents: 2000,
    notes: null,
    createdAt: "2025-01-01T12:00:00.000Z",
    updatedAt: "2025-01-01T12:00:00.000Z",
    items: [
      {
        id: "line-1",
        orderId: "order-1",
        menuItemId: "item-1",
        quantity: 2,
        unitPriceCents: 1000,
        lineTotalCents: 2000,
        createdAt: "2025-01-01T12:00:00.000Z",
      },
    ],
    ...overrides,
  };
}

function renderDrawer(order: OrderWithItems | null) {
  const client = new QueryClient();
  return render(
    <ThemeProvider mode="light">
      <QueryClientProvider client={client}>
        <ToastProvider>
          <OrderDetailDrawer order={order} onClose={vi.fn()} />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe("OrderDetailDrawer", () => {
  beforeEach(() => {
    vi.mocked(useGetCustomersId).mockReturnValue({
      isLoading: false,
      data: {
        status: 200,
        data: { id: "customer-1", name: "Jane Doe", email: "jane@example.com", phone: null },
      },
    } as unknown as ReturnType<typeof useGetCustomersId>);
    vi.mocked(useGetMenuItems).mockReturnValue({
      data: { status: 200, data: [{ id: "item-1", name: "Burger" }] },
    } as unknown as ReturnType<typeof useGetMenuItems>);
    vi.mocked(usePostOrdersIdActions).mockReturnValue({
      isPending: false,
      mutate: mutateMock,
    } as unknown as ReturnType<typeof usePostOrdersIdActions>);
    mutateMock.mockReset();
  });

  it("renders customer name and order items", () => {
    renderDrawer(buildOrder());
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("Burger")).toBeTruthy();
    expect(screen.getByText(/× 2/)).toBeTruthy();
  });

  it("shows only valid action buttons for pending status", () => {
    renderDrawer(buildOrder({ status: "pending" }));
    expect(screen.getByRole("button", { name: "Accept" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Complete" })).toBeNull();
  });

  it("calls mutate with the accept action when Accept is pressed", async () => {
    renderDrawer(buildOrder({ status: "pending" }));
    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(mutateMock).toHaveBeenCalledWith({
      id: "order-1",
      data: { action: "accept" },
    });
  });

  it("shows EmptyState when the order has no available actions", () => {
    renderDrawer(buildOrder({ status: "completed" }));
    expect(screen.getByText("No actions available")).toBeTruthy();
  });
});
