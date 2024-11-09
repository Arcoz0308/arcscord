import type { ArcClient } from "#/base/client/client.class";
import type { LoggerInterface } from "#/utils/logger/logger.type";

/**
 * Abstract class representing a base manager that all other managers should extend.
 */
export abstract class BaseManager {
  /**
   * The client instance
   */
  client: ArcClient;

  /**
   * The name of the manager. Should be defined by subclasses.
   */
  abstract name: string;

  /**
   * Constructs a new instance of the BaseManager.
   *
   * @param client - The ArcClient instance.
   */
  constructor(client: ArcClient) {
    this.client = client;
  }

  /**
   * @internal
   */
  _logger?: LoggerInterface;

  /**
   * Retrieves the logger associated with the manager.
   * If no logger exists, a new one is created using the client's logger constructor.
   */
  get logger(): LoggerInterface {
    if (!this._logger) {
      this._logger = this.client.createLogger(this.name);
    }
    return this._logger;
  }

  /**
   * Logs a trace message if tracing is enabled in the client options.
   *
   * @param msg - The message to be logged.
   */
  trace(msg: string): void {
    if (this.client.arcOptions.displayTrace) {
      this.logger.trace(msg);
    }
  }
}
