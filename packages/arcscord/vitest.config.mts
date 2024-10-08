import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "#/": new URL("./src/", import.meta.url).pathname,
    },
  },
  test: {
    exclude: [...configDefaults.exclude, "**.no.test.ts"],
  },
});
