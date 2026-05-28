import type { MenuCategory, MenuItem } from "@ody/api-client";

type ListResponse<T> = { status: number; data: T };

export function selectCategories(
  response: ListResponse<MenuCategory[]> | undefined,
): MenuCategory[] {
  return response?.status === 200 ? response.data : [];
}

export function selectItems(
  response: ListResponse<MenuItem[]> | undefined,
): MenuItem[] {
  return response?.status === 200 ? response.data : [];
}
