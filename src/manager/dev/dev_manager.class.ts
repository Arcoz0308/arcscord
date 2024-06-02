import { env, isDev } from "#/utils/config/env";
import { devConfigSchema } from "#/manager/dev/dev.z";
import { readFileSync } from "fs";
import { DEFAULT_DEV_CONFIG_FILE_PATH } from "#/manager/dev/dev.const";
import type { DevConfig, DevConfigKey } from "#/manager/dev/dev.type";
import { defaultLogger } from "#/utils/logger/logger.class";

export class DevManager {

  config?: DevConfig;

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
      return defaultLogger.fatal("failed to open dev config path !", {
        path: env.DEV_FILE_PATH ?? DEFAULT_DEV_CONFIG_FILE_PATH,
      });
    }
    const ok = devConfigSchema.safeParse(JSON.parse(fileContent.toString()));
    if (!ok.success) {
      return defaultLogger.fatal("failed to parse config", {
        zodError: ok.error.message,
        details: ok.error.format(),
      });
    }
    this.config = ok.data;
  }

  isDevEnable(name: string, type: DevConfigKey): boolean {
    return this.config?.[type]?.includes(name) ?? false;
  }

}