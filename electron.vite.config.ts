import { resolve, join } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import { cpSync } from "fs";

export default defineConfig({
  main: {
    plugins: [
      {
        name: "copy-resources",
        closeBundle: () => {
          const src = join(__dirname, "resources", "fonts");
          const dest = join(__dirname, "out", "main", "fonts");
          cpSync(src, dest, { recursive: true });
        }
      }
    ]
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@common": resolve("src/common")
      }
    },
    plugins: [react()]
  }
});
