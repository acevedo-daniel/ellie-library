import React from "react";
import clsx from "clsx";

export type ToastProps = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  visible: boolean;
  onClose?: () => void;
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  onClose,
}) => {
  React.useEffect(() => {
    if (visible && onClose) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  const baseStyle =
    "fixed left-1/2 bottom-8 z-50 -translate-x-1/2 px-4 py-1.5 rounded-md shadow text-white font-medium text-sm transition-all duration-500 ease-in-out";

  const colors: Record<typeof type, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black",
  };

  // Fade in/out usando opacidad y transición
  return (
    <div
      className={clsx(
        baseStyle,
        colors[type],
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ transitionProperty: "opacity, transform" }}
    >
      {message}
    </div>
  );
};
