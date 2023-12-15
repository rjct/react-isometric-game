import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";
// eslint-disable-next-line no-restricted-imports
import customManifestPlugin from "./customManifestPlugin";

const BASE_URL = "/react-isometric-game";

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  build: {
    manifest: false,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: [
      { find: "@src", replacement: "/src" },
      { find: "@assets", replacement: "/public/assets" },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    customManifestPlugin("./public", BASE_URL),
    eslint({
      include: ["**/*.ts", "**/*.tsx"],
      lintOnStart: true,
    }),
    stylelint({
      lintOnStart: true,
    }),
    checker({
      typescript: true,
    }),
    react(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_BUILD_DATE__: JSON.stringify(new Date().valueOf()),
  },
});
