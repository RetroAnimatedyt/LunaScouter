import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "LunaScouter",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "LunaScouter",
        short_name: "LunaScouter",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          }
        ],
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff"
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: { cacheName: "html-cache" }
          },
          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "NetworkFirst",
            options: { cacheName: "js-cache" }
          },
          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "NetworkFirst",
            options: { cacheName: "css-cache" }
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: { cacheName: "image-cache" }
          }
        ]
      }
    })
  ]
});
