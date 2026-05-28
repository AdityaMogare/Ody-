import type { Customer, MenuItem, OrderStatus, OrderWithItems } from "@ody/api-client";
import { useMemo } from "react";

import { formatPriceCents } from "../lib/menu";
import { formatTimeAgo, isToday } from "../lib/time";

const PENDING_STATUSES: OrderStatus[] = ["pending", "accepted", "preparing"];

export type RecentOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalCents: number;
  status: OrderStatus;
  timeAgo: string;
};

export type TopMenuItemRow = {
  menuItemId: string;
  name: string;
  orderCount: number;
  barFraction: number;
};

export type HomeStats = {
  totalOrdersToday: number;
  revenueTodayFormatted: string;
  pendingOrders: number;
  mostPopularItemName: string;
  recentOrders: RecentOrderRow[];
  topMenuItems: TopMenuItemRow[];
};

type UseHomeStatsInput = {
  orders: OrderWithItems[];
  customers: Customer[];
  menuItems: MenuItem[];
};

function countItemsByMenuId(orders: OrderWithItems[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const order of orders) {
    for (const line of order.items) {
      counts.set(line.menuItemId, (counts.get(line.menuItemId) ?? 0) + line.quantity);
    }
  }
  return counts;
}

export function useHomeStats({ orders, customers, menuItems }: UseHomeStatsInput): HomeStats {
  return useMemo(() => {
    const customerMap = new Map(customers.map((c) => [c.id, c.name]));
    const menuNameMap = new Map(menuItems.map((m) => [m.id, m.name]));
    const itemCounts = countItemsByMenuId(orders);

    const todayOrders = orders.filter((o) => isToday(o.createdAt));
    const revenueTodayCents = todayOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.totalCents, 0);

    const pendingOrders = orders.filter((o) => PENDING_STATUSES.includes(o.status)).length;

    let mostPopularItemId: string | null = null;
    let topCount = 0;
    for (const [menuItemId, count] of itemCounts) {
      if (count > topCount) {
        topCount = count;
        mostPopularItemId = menuItemId;
      }
    }

    const mostPopularItemName = mostPopularItemId
      ? (menuNameMap.get(mostPopularItemId) ?? "Unknown item")
      : "—";

    const rankedItems = [...itemCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxBarCount = rankedItems[0]?.[1] ?? 0;

    const topMenuItems: TopMenuItemRow[] = rankedItems.map(([menuItemId, orderCount]) => ({
      menuItemId,
      name: menuNameMap.get(menuItemId) ?? "Unknown item",
      orderCount,
      barFraction: maxBarCount > 0 ? orderCount / maxBarCount : 0,
    }));

    const recentOrders: RecentOrderRow[] = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((order) => ({
        id: order.id,
        orderNumber: order.id.slice(0, 8),
        customerName: order.customerId
          ? (customerMap.get(order.customerId) ?? "Unknown")
          : "Walk-in",
        totalCents: order.totalCents,
        status: order.status,
        timeAgo: formatTimeAgo(order.createdAt),
      }));

    return {
      totalOrdersToday: todayOrders.length,
      revenueTodayFormatted: formatPriceCents(revenueTodayCents),
      pendingOrders,
      mostPopularItemName,
      recentOrders,
      topMenuItems,
    };
  }, [orders, customers, menuItems]);
}
