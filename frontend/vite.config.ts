import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Only reachable from this machine, not from other devices on your network.
    host: "127.0.0.1",
    port: 5173,
    // Forward /api requests to the Flask server so no CORS setup is needed.
    proxy: { "/api": "http://127.0.0.1:5000" },
  },
});
