import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy: /api -> Spring Boot (so CORS ki problem dev me nahi aayegi)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
