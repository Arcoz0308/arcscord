import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // @ts-expect-error fix error with import
      "#/": new URL("./src/", import.meta.url).pathname,
    },
  },
});