import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      srcDir: "src",
      filename: "my-worker.ts",
      strategies: "injectManifest",
      registerType: "autoUpdate",
      injectManifest: {
        minify: false,
        enableWorkboxModulesLogs: true,
      },
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
      manifest: {
        name: "QuizFriends",
        short_name: "QuizFriends",
        screenshots: [
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "Application",
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "narrow",
            label: "Mobile application",
          },
        ],
        icons: [
          {
            src: "/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#c6371a",
        background_color: "#fff",
        display: "standalone",
        description: "QuizFriends",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [],
        globPatterns: [],
      },
    }),
  ],
  define: {
    "import.meta.env": {}, // Prevents ESLint issues
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"), // ✅ works locally & on Vercel
    },
  },
});
