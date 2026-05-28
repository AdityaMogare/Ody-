import { z } from "@hono/zod-openapi";

import type { OpeningHours } from "../db/schema";
import {
  insertCustomerSchema,
  insertMenuCategorySchema,
  insertMenuItemSchema,
  selectCustomerSchema,
  selectMenuCategorySchema,
  selectMenuItemSchema,
  selectOrderItemSchema,
  selectOrderSchema,
} from "../db/zod";
import { orderActions } from "../services/order-state-machine";

const OpeningHoursDaySchema = z
  .object({ open: z.string(), close: z.string() })
  .nullable();

const OpeningHoursSchema = z
  .object({
    mon: OpeningHoursDaySchema,
    tue: OpeningHoursDaySchema,
    wed: OpeningHoursDaySchema,
    thu: OpeningHoursDaySchema,
    fri: OpeningHoursDaySchema,
    sat: OpeningHoursDaySchema,
    sun: OpeningHoursDaySchema,
  })
  .openapi("OpeningHours");

export const ErrorSchema = z
  .object({ error: z.string() })
  .openapi("Error");

export const MenuCategorySchema = selectMenuCategorySchema.openapi("MenuCategory");
export const MenuItemSchema = selectMenuItemSchema.openapi("MenuItem");
export const CustomerSchema = selectCustomerSchema.openapi("Customer");
export const OrderSchema = selectOrderSchema.openapi("Order");
export const OrderItemSchema = selectOrderItemSchema.openapi("OrderItem");
export const SettingsSchema = z
  .object({
    id: z.string().uuid(),
    restaurantName: z.string().min(1),
    prepTimeMinutes: z.number().int(),
    autoAcceptOrders: z.boolean(),
    serviceAvailable: z.boolean(),
    openingHours: OpeningHoursSchema,
    updatedAt: z.string().datetime(),
  })
  .openapi("RestaurantSettings");

export const CreateMenuCategoryBodySchema = insertMenuCategorySchema
  .pick({ name: true, sortOrder: true })
  .openapi("CreateMenuCategoryBody");

export const CreateMenuItemBodySchema = insertMenuItemSchema
  .pick({
    categoryId: true,
    name: true,
    description: true,
    priceCents: true,
    available: true,
  })
  .openapi("CreateMenuItemBody");

export const UpdateMenuItemBodySchema = CreateMenuItemBodySchema.partial().openapi(
  "UpdateMenuItemBody",
);

export const CreateCustomerBodySchema = insertCustomerSchema
  .pick({ name: true, email: true, phone: true })
  .openapi("CreateCustomerBody");

export const CreateOrderItemInputSchema = z
  .object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })
  .openapi("CreateOrderItemInput");

export const CreateOrderBodySchema = z
  .object({
    customerId: z.string().uuid().nullable().optional(),
    items: z.array(CreateOrderItemInputSchema).min(1),
    subtotalCents: z.number().int().nonnegative(),
    taxCents: z.number().int().nonnegative().default(0),
    totalCents: z.number().int().nonnegative(),
    notes: z.string().optional(),
  })
  .openapi("CreateOrderBody");

export const UpdateOrderBodySchema = z
  .object({
    notes: z.string().nullable().optional(),
  })
  .openapi("UpdateOrderBody");

export const OrderActionBodySchema = z
  .object({
    action: z.enum(orderActions),
  })
  .openapi("OrderActionBody");

export const OrderActionResultSchema = z
  .object({
    order: OrderSchema,
    previousStatus: z.string(),
    action: z.enum(orderActions),
    allowedActions: z.array(z.enum(orderActions)),
  })
  .openapi("OrderActionResult");

export const OrderWithItemsSchema = OrderSchema.extend({
  items: z.array(OrderItemSchema),
}).openapi("OrderWithItems");

export const CustomerDetailSchema = CustomerSchema.extend({
  orderCount: z.number().int().nonnegative(),
  totalSpendCents: z.number().int().nonnegative(),
  orders: z.array(OrderWithItemsSchema),
}).openapi("CustomerDetail");

export const UpdateSettingsBodySchema = z
  .object({
    restaurantName: z.string().min(1).optional(),
    prepTimeMinutes: z.number().int().min(1).max(120).optional(),
    autoAcceptOrders: z.boolean().optional(),
    serviceAvailable: z.boolean().optional(),
    openingHours: OpeningHoursSchema.optional(),
  })
  .openapi("UpdateSettingsBody");

export type OpeningHoursInput = OpeningHours;

export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export const OrderListQuerySchema = z.object({
  status: z
    .enum([
      "pending",
      "accepted",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ])
    .optional(),
  customerId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
});
