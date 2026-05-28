import type { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";
import { Button } from "./Button";

export type DrawerProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
};

function createDrawerStyles(t: Theme) {
  return {
    overlay: {
      flex: 1,
      backgroundColor: t.semantic.overlay,
      alignItems: "flex-end" as const,
      justifyContent: "center" as const,
    },
    panel: {
      width: "100%" as const,
      maxWidth: 460,
      height: "100%" as const,
      backgroundColor: t.semantic.surface,
      padding: t.spacing[5],
      gap: t.spacing[4],
      borderLeftWidth: 1,
      borderLeftColor: t.semantic.border,
    },
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: t.spacing[2],
    },
    title: {
      fontSize: t.typography.fontSize.xl,
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
      flex: 1,
    },
    body: { flex: 1, gap: t.spacing[3] },
    footer: { flexDirection: "row" as const, justifyContent: "flex-end" as const, gap: t.spacing[2] },
  };
}

export function Drawer({ visible, title, children, onClose, footer }: DrawerProps) {
  const styles = useStyles(createDrawerStyles);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Button label="Close" variant="ghost" size="sm" onPress={onClose} />
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
