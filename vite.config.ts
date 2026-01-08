import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ipapi": {
        target: "https://ipapi.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ipapi/, ""),
      },
    },
  },
});
