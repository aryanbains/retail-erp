import { useCallback } from "react";
import { toast as hotToast, ToastOptions } from "react-hot-toast";

export function useToast() {
  const toast = useCallback(
    (options: ToastOptions & { title?: string; description?: string; variant?: "destructive" | string }) => {
      hotToast(
        options.title
          ? `${options.title}${options.description ? ": " + options.description : ""}`
          : options.description || "",
        {
          ...options,
          icon: options.variant === "destructive" ? "❌" : undefined,
        }
      );
    },
    []
  );
  return { toast };
}
