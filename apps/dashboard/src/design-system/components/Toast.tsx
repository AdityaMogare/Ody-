import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Pressable, Text, View } from "react-native";

import { useStyles } from "../createStyles";
import { platformShadow } from "../platformShadow";
import { useTheme, type Theme } from "../theme";
import type { BadgeVariant } from "./Badge";

export type ToastVariant = BadgeVariant;

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  show: (toast: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function toastVariantStyle(
  t: Theme,
  variant: ToastVariant,
): { backgroundColor: string; borderColor: string } {
  const map: Record<ToastVariant, { backgroundColor: string; borderColor: string }> = {
    neutral: { backgroundColor: t.semantic.surface, borderColor: t.semantic.borderStrong },
    success: { backgroundColor: t.semantic.successMuted, borderColor: t.semantic.success },
    warning: { backgroundColor: t.semantic.warningMuted, borderColor: t.semantic.warning },
    error: { backgroundColor: t.semantic.errorMuted, borderColor: t.semantic.error },
    info: { backgroundColor: t.semantic.infoMuted, borderColor: t.semantic.info },
  };
  return map[variant];
}

function createToastStyles(t: Theme) {
  return {
    host: {
      position: "absolute" as const,
      top: t.spacing[6],
      right: t.spacing[4],
      left: t.spacing[4],
      gap: t.spacing[2],
      zIndex: 1000,
      pointerEvents: "box-none" as const,
    },
    toast: {
      borderRadius: t.radii.md,
      borderWidth: 1,
      padding: t.spacing[3],
      ...platformShadow("md", t),
    },
    title: {
      fontSize: t.typography.fontSize.sm,
      fontWeight: t.typography.fontWeight.semibold,
      color: t.semantic.text,
    },
    description: {
      fontSize: t.typography.fontSize.xs,
      color: t.semantic.textMuted,
      marginTop: t.spacing[1],
    },
  };
}

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${++toastCounter}`;
    setToasts((current) => [...current, { ...toast, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  const theme = useTheme();
  const styles = useStyles(createToastStyles);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.host} pointerEvents="box-none">
      {toasts.map((toast) => {
        const variant = toast.variant ?? "neutral";
        return (
          <Pressable
            key={toast.id}
            accessibilityRole="alert"
            onPress={() => onDismiss(toast.id)}
            style={[styles.toast, toastVariantStyle(theme, variant)]}
          >
            <Text style={styles.title}>{toast.title}</Text>
            {toast.description ? (
              <Text style={styles.description}>{toast.description}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export { Toaster };
