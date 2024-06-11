import { Client as DJSClient, REST } from "discord.js";
import { CommandManager } from "#/manager/command/command_manager.class";
import { DevManager } from "#/manager/dev";
import { ArcLogger } from "#/utils/logger/logger.class";
import { EventManager } from "#/manager/event/event_manager.class";
import { TaskManager } from "#/manager/task/task_manager";
import type { ArcClientOptions } from "#/base/client/client.type";
import type { LoggerConstructor, LoggerInterface } from "#/utils/logger/logger.type";
import { createLogger } from "#/utils/logger/logger.util";

export class ArcClient extends DJSClient {

  commandManager: CommandManager;

  devManager: DevManager;

  eventManager: EventManager;

  taskManager : TaskManager;

  logger: LoggerInterface;

  rest: REST;

  ready = false;

  arcOptions: ArcClientOptions;

  loggerConstructor: LoggerConstructor;

  /**
   * Constructor for creating an instance of the ArcClient class.
   *
   * @param {string} token - The authentication token for the bot.
   * @param {ArcClientOptions} options - Additional options for configuring the client.
   */
  constructor(token: string, options: ArcClientOptions) {
    super(options);

    this.loggerConstructor = options.logger?.customLogger ?? ArcLogger;

    this.arcOptions = options;
    this.devManager = new DevManager(this);
    this.commandManager = new CommandManager(this);
    this.taskManager = new TaskManager(this);

    this.eventManager = new EventManager(this);

    this.logger = createLogger(this.loggerConstructor, "main", options.logger?.loggerFunc);


    this.token = token;

    this.rest = new REST({
      version: "10",
    }).setToken(token);


    this.on("ready", () => {
      this.ready = true;
      this.logger.info("bot connected...");
    });
  }

  waitReady(delay = 50): Promise<void> {
    return new Promise((resolve) => {
      if (this.ready) {
        return resolve();
      }

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(() => {
        if (this.ready) {
          return resolve();
        }

        // delay : 0.05s, 0.1s, 0.2s 0.4s, 0.8s, 0.5s, 1s, and repeat infinity last two
        return this.waitReady(delay <= 500 ? delay * 2 : 500);

      }, delay);

    });
  }

  createLogger(name: string): LoggerInterface {
    return createLogger(this.loggerConstructor, name, this.arcOptions.logger?.loggerFunc);
  }

}