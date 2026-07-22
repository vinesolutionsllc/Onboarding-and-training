import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const staticRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  root: staticRoot,
  base: "./",
  publicDir: `${projectRoot}public`,
  plugins: [react()],
  build: {
    outDir: `${projectRoot}github-pages-dist`,
    emptyOutDir: true,
  },
});
