import {
  getGetMenuCategoriesQueryKey,
  usePostMenuCategories,
} from "@ody/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Input, Modal, useToast } from "../../design-system";

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddCategoryModal({ visible, onClose }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const toast = useToast();

  const createCategory = usePostMenuCategories({
    mutation: {
      onSuccess: (res) => {
        if (res.status !== 201) return;
        queryClient.invalidateQueries({ queryKey: getGetMenuCategoriesQueryKey() });
        toast.show({ title: "Category created", variant: "success" });
        setName("");
        setError(undefined);
        onClose();
      },
      onError: () => {
        toast.show({ title: "Failed to create category", variant: "error" });
      },
    },
  });

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    createCategory.mutate({ data: { name: trimmed } });
  };

  const handleClose = () => {
    setName("");
    setError(undefined);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Add category"
      onClose={handleClose}
      footer={
        <>
          <Button label="Cancel" variant="secondary" onPress={handleClose} />
          <Button
            label="Save"
            loading={createCategory.isPending}
            onPress={handleSubmit}
          />
        </>
      }
    >
      <Input
        label="Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) setError(undefined);
        }}
        errorText={error}
        placeholder="e.g. Mains"
      />
    </Modal>
  );
}
