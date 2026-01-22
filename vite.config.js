import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite Configuration
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  base: "/NERV-admin-panel/",
});
