import React from "react";
import { createRoot } from "react-dom/client";
import { MyChat } from "./MyChat";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MyChat />
  </React.StrictMode>
);
