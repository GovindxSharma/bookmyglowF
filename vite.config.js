import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true, // Allow public tunnels and custom domains
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/appointments": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/services": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/employee": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/payments": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/attendance": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/salon-info": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
