import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // @ts-expect-error fix error with import
      "#/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
