import type { MenuCategory, MenuItem } from "@ody/api-client";
import {
  getGetMenuItemsQueryKey,
  usePatchMenuItemsId,
  usePostMenuItems,
} from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  Button,
  Input,
  Modal,
  Select,
  Toggle,
  useToast,
} from "../../design-system";
import { centsToDollarsInput, dollarsToCents } from "../../lib/menu";

type AddEditItemModalProps = {
  visible: boolean;
  mode: "add" | "edit";
  item?: MenuItem;
  categories: MenuCategory[];
  defaultCategoryId?: string;
  onClose: () => void;
};

export function AddEditItemModal({
  visible,
  mode,
  item,
  categories,
  defaultCategoryId,
  onClose,
}: AddEditItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    categoryId?: string;
  }>({});

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (!visible) return;
    if (mode === "edit" && item) {
      setName(item.name);
      setDescription(item.description ?? "");
      setPrice(centsToDollarsInput(item.priceCents));
      setCategoryId(item.categoryId);
      setAvailable(item.available);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId(defaultCategoryId ?? categories[0]?.id);
      setAvailable(true);
    }
    setErrors({});
  }, [visible, mode, item, defaultCategoryId, categories]);

  const invalidateItems = () =>
    queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });

  const createItem = usePostMenuItems({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 201) return;
        invalidateItems();
        toast.show({ title: "Item created", variant: "success" });
        onClose();
      },
      onError: () => toast.show({ title: "Failed to create item", variant: "error" }),
    },
  });

  const updateItem = usePatchMenuItemsId({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 200) return;
        invalidateItems();
        toast.show({ title: "Item updated", variant: "success" });
        onClose();
      },
      onError: () => toast.show({ title: "Failed to update item", variant: "error" }),
    },
  });

  const isPending = createItem.isPending || updateItem.isPending;

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    const trimmedName = name.trim();
    if (!trimmedName) nextErrors.name = "Name is required";
    const priceCents = dollarsToCents(price);
    if (priceCents === null) nextErrors.price = "Enter a valid price";
    if (!categoryId) nextErrors.categoryId = "Category is required";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const body = {
      name: trimmedName,
      description: description.trim() || undefined,
      priceCents: priceCents!,
      categoryId: categoryId!,
      available,
    };

    if (mode === "edit" && item) {
      updateItem.mutate({ id: item.id, data: body });
    } else {
      createItem.mutate({ data: body });
    }
  };

  return (
    <Modal
      visible={visible}
      title={mode === "edit" ? "Edit item" : "Add item"}
      onClose={onClose}
      footer={
        <>
          <Button label="Cancel" variant="secondary" onPress={onClose} />
          <Button label="Save" loading={isPending} onPress={handleSubmit} />
        </>
      }
    >
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        errorText={errors.name}
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Optional"
      />
      <Input
        label="Price (USD)"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        placeholder="12.50"
        errorText={errors.price}
      />
      <Select
        label="Category"
        options={categories.map((c) => ({ label: c.name, value: c.id }))}
        value={categoryId}
        onChange={setCategoryId}
        errorText={errors.categoryId}
      />
      <Toggle label="Available" value={available} onValueChange={setAvailable} />
    </Modal>
  );
}
