import type { ReactNode } from "react";
import {
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type ModalProps as RNModalProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useStyles } from "../createStyles";
import type { Theme } from "../theme";
import { Button } from "./Button";

export type ModalProps = Pick<
  RNModalProps,
  "visible" | "onRequestClose" | "animationType"
> & {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  showClose?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

function createModalStyles(t: Theme) {
  return {
    backdrop: {
      flex: 1,
      backgroundColor: t.semantic.overlay,
      justifyContent: "center" as const,
      padding: t.spacing[6],
    },
    card: {
      backgroundColor: t.semantic.surface,
      borderRadius: t.radii.lg,
      padding: t.spacing[5],
      gap: t.spacing[4],
      maxWidth: 520,
      width: "100%" as const,
      alignSelf: "center" as const,
    },
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    title: {
      fontSize: t.typography.fontSize.xl,
      fontWeight: t.typography.fontWeight.bold,
      color: t.semantic.text,
    },
    body: { gap: t.spacing[3] },
    footer: {
      flexDirection: "row" as const,
      justifyContent: "flex-end" as const,
      gap: t.spacing[2],
    },
  };
}

export function Modal({
  visible,
  title,
  children,
  footer,
  onClose,
  onRequestClose,
  showClose = true,
  animationType = "fade",
  contentStyle,
}: ModalProps) {
  const styles = useStyles(createModalStyles);
  const handleClose = onClose ?? onRequestClose;

  return (
    <RNModal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={[styles.card, contentStyle]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {showClose && handleClose ? (
              <Button label="Close" variant="ghost" size="sm" onPress={handleClose} />
            ) : null}
          </View>
          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
