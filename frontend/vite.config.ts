import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: true,
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increased limit to 1000kB to reduce noise for moderately large chunks
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "zego-vendor": ["@zegocloud/zego-uikit-prebuilt"],
          "ui-vendor": ["framer-motion", "lucide-react", "react-icons", "chart.js", "react-chartjs-2"],
        },
      },
    },
  },
});
