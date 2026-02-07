import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Base path for GitHub Pages: https://<user>.github.io/<repo>/
const base = "/boulough-al-maram-hub/";

export default defineConfig(({ mode }) => ({
  base,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Copy index.html to 404.html so GitHub Pages serves the SPA for client-side routes
    {
      name: "copy-404",
      closeBundle() {
        const out = path.resolve(__dirname, "dist");
        const src = path.join(out, "index.html");
        const dest = path.join(out, "404.html");
        if (fs.existsSync(src)) fs.copyFileSync(src, dest);
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
