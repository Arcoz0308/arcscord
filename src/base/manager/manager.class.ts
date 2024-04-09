import type { Client } from "#/base/client/client.class";
import { Logger } from "#/utils/logger/logger.class";
import type { DevConfigKey, DevFacultative } from "#/manager/dev";

export abstract class BaseManager {

  client: Client;

  name = "undefined";

  logger: Logger;

  devConfigKey: DevConfigKey|null = null;

  constructor(client: Client) {
    this.client = client;
    this.logger = new Logger(this.name);
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