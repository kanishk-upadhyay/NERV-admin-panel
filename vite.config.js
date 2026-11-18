import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite Configuration
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  base: "/NERV-admin-panel/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          "vendor-charts": ["recharts"],
        },
      },
    },
  },
});
