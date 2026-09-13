import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Builds the React islands used by the static site (currently the Global Markets globe).
// Output lands in js/globe/ and is committed, so the HTML pages themselves need no build step.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  base: "./",
  publicDir: false,
  build: {
    outDir: "js/globe",
    emptyOutDir: true,
    // The three.js chunk is ~1 MB but is only fetched when the globe scrolls into view.
    chunkSizeWarningLimit: 1100,
    rolldownOptions: {
      input: { "chw-globe": "src/chw-globe.tsx" },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
