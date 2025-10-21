import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextType extends ToastState {
  showToast: (msg: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = useCallback(
    (msg: string, type: ToastType = "info", duration = 2500) => {
      setToast({ message: msg, type, visible: true });
      setTimeout(
        () => setToast((prev) => ({ ...prev, visible: false })),
        duration
      );
    },
    []
  );

  return (
    <ToastContext.Provider value={{ ...toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
