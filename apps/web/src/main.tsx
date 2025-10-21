import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryProvider } from "./app/providers/QueryProvider.js";
import { ToastProvider } from "./components/ToastContext.js";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ToastProvider>
  </React.StrictMode>
);
