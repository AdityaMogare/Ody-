import type { MenuItem } from "@ody/api-client";
import { useState } from "react";
import { View } from "react-native";

import { useTheme } from "../design-system";
import { AddCategoryModal } from "../features/menu/AddCategoryModal";
import { AddEditItemModal } from "../features/menu/AddEditItemModal";
import { DeleteItemModal } from "../features/menu/DeleteItemModal";
import { MenuCategorySidebar } from "../features/menu/MenuCategorySidebar";
import { MenuItemsPanel } from "../features/menu/MenuItemsPanel";
import { useMenuPage } from "../features/menu/useMenuPage";

export function MenuScreen() {
  const theme = useTheme();
  const menu = useMenuPage();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemModal, setItemModal] = useState<
    { mode: "add" } | { mode: "edit"; item: MenuItem } | null
  >(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: theme.semantic.background }}>
      <MenuCategorySidebar
        categories={menu.categories}
        items={menu.items}
        selectedId={menu.selectedCategoryId}
        loading={menu.loading}
        onSelect={menu.setSelectedCategoryId}
        onAddCategory={() => setCategoryModalOpen(true)}
      />
      <MenuItemsPanel
        categoryName={menu.selectedCategoryName}
        items={menu.categoryItems}
        loading={menu.loading}
        error={menu.error}
        togglingId={menu.togglingId}
        onAddItem={() => setItemModal({ mode: "add" })}
        onEditItem={(item) => setItemModal({ mode: "edit", item })}
        onDeleteItem={setDeleteItem}
        onToggleAvailable={menu.toggleAvailable}
      />
      <AddCategoryModal
        visible={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
      <AddEditItemModal
        visible={Boolean(itemModal)}
        mode={itemModal?.mode ?? "add"}
        item={itemModal?.mode === "edit" ? itemModal.item : undefined}
        categories={menu.categories}
        defaultCategoryId={menu.selectedCategoryId ?? undefined}
        onClose={() => setItemModal(null)}
      />
      <DeleteItemModal item={deleteItem} onClose={() => setDeleteItem(null)} />
    </View>
  );
}
