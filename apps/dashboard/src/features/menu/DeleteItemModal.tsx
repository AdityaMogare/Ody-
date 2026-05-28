import type { MenuItem } from "@ody/api-client";
import { getGetMenuItemsQueryKey, useDeleteMenuItemsId } from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Text } from "react-native";

import { Button, Modal, useTheme, useToast } from "../../design-system";

type DeleteItemModalProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function DeleteItemModal({ item, onClose }: DeleteItemModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const toast = useToast();

  const deleteItem = useDeleteMenuItemsId({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 200) return;
        queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
        toast.show({ title: "Item deleted", variant: "success" });
        onClose();
      },
      onError: () => toast.show({ title: "Failed to delete item", variant: "error" }),
    },
  });

  return (
    <Modal
      visible={Boolean(item)}
      title="Delete item"
      onClose={onClose}
      footer={
        <>
          <Button label="Cancel" variant="secondary" onPress={onClose} />
          <Button
            label="Delete"
            variant="danger"
            loading={deleteItem.isPending}
            onPress={() => item && deleteItem.mutate({ id: item.id })}
          />
        </>
      }
    >
      <Text style={{ color: theme.semantic.textMuted, fontSize: theme.typography.fontSize.md }}>
        Are you sure you want to delete{" "}
        <Text style={{ fontWeight: theme.typography.fontWeight.semibold }}>
          {item?.name}
        </Text>
        ? This cannot be undone.
      </Text>
    </Modal>
  );
}
