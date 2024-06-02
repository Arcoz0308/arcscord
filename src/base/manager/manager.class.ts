import type { ArcClient } from "#/base/client/client.class";
import { ArcLogger } from "#/utils/logger/logger.class";
import type { DevConfigKey, DevFacultative } from "#/manager/dev";
import type { LoggerInterface } from "#/utils/logger/logger.type";
import { createLogger } from "#/utils/logger/logger.util";

export abstract class BaseManager {

  client: ArcClient;

  abstract name: string;

  devConfigKey: DevConfigKey|null = null;

  constructor(client: ArcClient) {
    this.client = client;
  }

  _logger?: LoggerInterface;

  get logger(): LoggerInterface {
    if (!this._logger) {
      const options = this.client.arcOptions;

      if (options.logger?.customLogger) {
        this._logger = createLogger(options.logger.customLogger, this.name, options.logger.loggerFunc);
      } else {
        this._logger = createLogger(ArcLogger, this.name, options.logger?.loggerFunc);
      }

    }
    return this._logger;
  }


  isEnableInDev(obj: DevFacultative): boolean {
    if (obj.isEnableInDev) {
      return true;
    }
    if (this.devConfigKey) {
      return this.client.devManager.isDevEnable(obj.name, this.devConfigKey);
    }
    return false;
  }

  checkInDev<T extends DevFacultative>(objs: T[]): T[] {
    this.logger.trace(`Filter for dev mode (full list : ${objs.map((obj) => obj.name).join(", ")})`);
    const enabledInDev = objs.filter(obj => this.isEnableInDev(obj));
    this.logger.trace(`Filtered for dev mode (enabled : ${enabledInDev.map((obj) => obj.name).join(", ")})`);
    return enabledInDev;
  }

}