import { relative, resolve as resolveDir } from "node:path";
import process from "node:process";
import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  minify: true,
  skipNodeModulesBundle: true,
  target: "es2022",
  tsconfig: relative(__dirname, resolveDir(process.cwd(), "src", "tsconfig.json")),
  keepNames: true,
  treeshake: true,
  format: "esm",
});
