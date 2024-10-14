import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "./packages/arcscord/vitest.config.mts",
  "./packages/better_error/vitest.config.mts",
  "./packages/error/vitest.config.mts",
]);
