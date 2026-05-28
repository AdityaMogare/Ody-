import type { MenuItem } from "@ody/api-client";
import {
  getGetMenuItemsQueryKey,
  useGetMenuCategories,
  useGetMenuItems,
  usePatchMenuItemsId,
} from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { selectCategories, selectItems } from "./menu-queries";

export function useMenuPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const categoriesQuery = useGetMenuCategories({
    query: { select: selectCategories },
  });
  const itemsQuery = useGetMenuItems({
    query: { select: selectItems },
  });

  const categories = categoriesQuery.data ?? [];
  const items = itemsQuery.data ?? [];

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const categoryItems = useMemo(
    () =>
      selectedCategoryId
        ? items.filter((i) => i.categoryId === selectedCategoryId)
        : [],
    [items, selectedCategoryId],
  );

  const patchItem = usePatchMenuItemsId({
    mutation: {
      onMutate: async ({ id, data }) => {
        setTogglingId(id);
        await queryClient.cancelQueries({ queryKey: getGetMenuItemsQueryKey() });
        const previous = queryClient.getQueryData(
          getGetMenuItemsQueryKey(),
        ) as { status: number; data: MenuItem[] } | undefined;

        if (previous?.status === 200) {
          queryClient.setQueryData(getGetMenuItemsQueryKey(), {
            ...previous,
            data: previous.data.map((row) =>
              row.id === id ? { ...row, ...data } : row,
            ),
          });
        }

        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(getGetMenuItemsQueryKey(), context.previous);
        }
      },
      onSettled: () => {
        setTogglingId(null);
        queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
      },
    },
  });

  const toggleAvailable = (item: MenuItem, available: boolean) => {
    patchItem.mutate({ id: item.id, data: { available } });
  };

  return {
    categories,
    categoryItems,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCategoryName: selectedCategory?.name,
    items,
    loading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error:
      categoriesQuery.isError || itemsQuery.isError
        ? "Failed to load menu data."
        : null,
    togglingId,
    toggleAvailable,
  };
}
