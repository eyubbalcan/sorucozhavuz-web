import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "icons/favicon.svg",
        "icons/icon-180x180.png",
        "icons/maskable-icon.png",
        "icons/icon-144x144.png",
        "icons/icon-192x192.png",
        "icons/icon-512x512.png",

      ],
      manifest: {
        name: "Seduss Soru Havuzu",
        short_name: "Seduss",
        description: "Seduss Soru Havuzu",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: 'screenshots/screenshot-1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'screenshots/screenshot-2.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
      },
    }),
  ],
});
