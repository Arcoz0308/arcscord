import { devConfigSchema } from "#/manager/dev/dev.z";
import { readFileSync } from "fs";
import type { DevConfig, DevConfigKey } from "#/manager/dev/dev.type";
import type { ArcClient } from "#/base";
import type { LoggerInterface } from "#/utils";

export class DevManager {

  config?: DevConfig;

  client: ArcClient;

  logger: LoggerInterface;

  constructor(client: ArcClient) {
    this.client = client;
    this.logger = client.createLogger("dev");
    if (client.arcOptions.dev?.enabled && client.arcOptions.dev.devManager) {
      this.load();
    }
  }

  load(): void {
    let fileContent: Buffer;
    const filePath = this.client.arcOptions.dev?.devFilePath;
    if (!filePath) {
      return this.logger.fatal("please specify a dev file in client option (options.dev.devFilePath");
    }
    try {
      fileContent = readFileSync(filePath);
    } catch (e) {
      return this.logger.fatal("failed to open dev config path !", {
        path: filePath,
      });
    }
    const ok = devConfigSchema.safeParse(JSON.parse(fileContent.toString()));
    if (!ok.success) {
      return this.logger.fatal("failed to parse config", {
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