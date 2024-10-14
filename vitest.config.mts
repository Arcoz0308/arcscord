import { createVitestConfig } from "./scripts/vitest.config.mjs";

export default createVitestConfig({
  esbuild: {
    target: "es2020",
  },
});
