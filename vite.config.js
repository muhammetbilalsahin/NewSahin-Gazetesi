// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
