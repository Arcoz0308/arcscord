import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "!src/**/__tests__/**", "!src/**/*.test.*", "!test"],
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2022",
  platform: "node",
  format: ["esm", "cjs"],
  dts: true,
});