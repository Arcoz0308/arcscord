import tsconfigPaths from "vite-tsconfig-paths";
import { createVitestConfig } from "../../scripts/vitest.config.mjs";

export default createVitestConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "#/": new URL("../../src", import.meta.url).pathname,
    },
  },
});
