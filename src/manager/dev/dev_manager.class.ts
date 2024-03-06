import { env, isDev } from "#/utils/config/env";
import type { z } from "zod";
import { devConfigSchema } from "#/manager/dev/dev.z";
import { readFileSync } from "fs";
import { DEFAULT_DEV_CONFIG_FILE_PATH } from "#/manager/dev/dev.const";

export class DevManager {

  config?: z.infer<typeof devConfigSchema>;

  constructor() {
    if (isDev) {
      this.load();
    }
  }

  load(): void {
    let fileContent: Buffer;
    try {
      fileContent = readFileSync(env.DEV_FILE_PATH ?? DEFAULT_DEV_CONFIG_FILE_PATH);
    } catch (e) {
      throw new Error("failed to open dev file");
    }
    const ok = devConfigSchema.safeParse(JSON.parse(fileContent.toString()));
    if (!ok.success) {
      throw ok.error;
    }
    this.config = ok.data;
  }

}