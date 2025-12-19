import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "BukPulse",
        short_name: "BukPulse",
        description: "Connecting students on campus",
        theme_color: "#ffffff",
        icons: [
          {
            src: "192bukp.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512bukp.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
