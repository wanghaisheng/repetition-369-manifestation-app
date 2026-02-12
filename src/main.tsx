import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./index.css";
import "./i18n";

const rootElement = document.getElementById("root")!;

// Use hydration for prerendered content, regular render otherwise
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <RouterProvider router={router} />);
} else {
  createRoot(rootElement).render(<RouterProvider router={router} />);
}
