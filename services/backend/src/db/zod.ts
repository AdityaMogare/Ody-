import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  customers,
  menuCategories,
  menuItems,
  orderItems,
  orders,
  restaurantSettings,
} from "./schema";

export const insertMenuCategorySchema = createInsertSchema(menuCategories);
export const selectMenuCategorySchema = createSelectSchema(menuCategories);

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  priceCents: z.number().int().nonnegative(),
});
export const selectMenuItemSchema = createSelectSchema(menuItems);

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);

export const insertOrderSchema = createInsertSchema(orders, {
  subtotalCents: z.number().int().nonnegative(),
  taxCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
});
export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  lineTotalCents: z.number().int().nonnegative(),
});
export const selectOrderItemSchema = createSelectSchema(orderItems);

export const insertRestaurantSettingsSchema =
  createInsertSchema(restaurantSettings);
export const selectRestaurantSettingsSchema =
  createSelectSchema(restaurantSettings);

export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type SelectMenuCategory = z.infer<typeof selectMenuCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type SelectMenuItem = z.infer<typeof selectMenuItemSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type SelectCustomer = z.infer<typeof selectCustomerSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SelectOrder = z.infer<typeof selectOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type SelectOrderItem = z.infer<typeof selectOrderItemSchema>;
export type InsertRestaurantSettings = z.infer<
  typeof insertRestaurantSettingsSchema
>;
export type SelectRestaurantSettings = z.infer<
  typeof selectRestaurantSettingsSchema
>;
