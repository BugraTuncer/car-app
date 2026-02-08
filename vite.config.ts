import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://sandbox.arabamd.com",
        changeOrigin: true,
      },
    },
  },
});
