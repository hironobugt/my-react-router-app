import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    target: "esnext",
  },
  ssr: {
    noExternal: ["react-redux", "@reduxjs/toolkit"],
    external: ["better-sqlite3", "drizzle-orm", "bcrypt"],
  },
  optimizeDeps: {
    exclude: ["better-sqlite3", "drizzle-orm", "bcrypt"],
  },
});