import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 10000,
    host: "0.0.0.0",
    allowedHosts: ["chatkit-starter-1.onrender.com"]
  }
});
