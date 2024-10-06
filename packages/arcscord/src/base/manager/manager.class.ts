import type { ArcClient } from "#/base/client/client.class";
import type { LoggerInterface } from "#/utils/logger/logger.type";

export abstract class BaseManager {

  client: ArcClient;

  abstract name: string;

  constructor(client: ArcClient) {
    this.client = client;
  }

  _logger?: LoggerInterface;

  get logger(): LoggerInterface {
    if (!this._logger) {
      this._logger = this.client.createLogger(this.name);

    }
    return this._logger;
  }

}