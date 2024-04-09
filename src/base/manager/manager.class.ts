import type { Client } from "#/base/client/client.class";
import { Logger } from "#/utils/logger/logger.class";
import type { DevConfigKey, DevFacultative } from "#/manager/dev";

export abstract class BaseManager {

  client: Client;

  abstract name: string;

  devConfigKey: DevConfigKey|null = null;

  constructor(client: Client) {
    this.client = client;
  }

  _logger?: Logger;

  get logger(): Logger {
    if (!this._logger) {
      this._logger = new Logger(this.name);
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