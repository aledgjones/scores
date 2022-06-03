import { createRoot } from "react-dom/client";
import { Router } from "./Router";
import { register } from "./register";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";

import "./globals.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>
);

if (process.env.NODE_ENV === "production") {
  register();
}
