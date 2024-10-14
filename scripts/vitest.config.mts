import type { ESBuildOptions } from "vite";
import { defaultExclude, defineConfig, type ViteUserConfig } from "vitest/config";

export function createVitestConfig(options: ViteUserConfig = {}) {
  return defineConfig({
    ...options,
    test: {
      ...options?.test,
      globals: true,
      exclude: [...defaultExclude, "**/*.no.test.ts"],
    },
    esbuild: {
      ...options?.esbuild,
      target: (options?.esbuild as ESBuildOptions | undefined)?.target ?? "es2022",
    },
  });
}
