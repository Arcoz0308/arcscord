import type { PermissionsString } from "discord.js";
import { Client as DJSClient, EmbedBuilder, REST } from "discord.js";
import { CommandManager } from "#/manager/command/command_manager.class";
import { DevManager } from "#/manager/dev";
import { ArcLogger } from "#/utils/logger/logger.class";
import { EventManager } from "#/manager/event/event_manager.class";
import { TaskManager } from "#/manager/task/task_manager";
import type { ArcClientOptions, MessageOptions } from "#/base/client/client.type";
import type { LoggerConstructor, LoggerInterface } from "#/utils/logger/logger.type";
import { createLogger } from "#/utils/logger/logger.util";
import { ComponentManager } from "#/manager";
import type { CommandDefinition } from "#/base/command/command_definition.type";
import type { Task } from "#/base";
import type { ComponentProps } from "#/base/components/component_props.type";
import type { EventHandler } from "#/base/event/event.type";

export class ArcClient extends DJSClient {

  commandManager: CommandManager;

  devManager: DevManager;

  eventManager: EventManager;

  taskManager : TaskManager;

  componentManager: ComponentManager;

  logger: LoggerInterface;

  rest: REST;

  ready = false;

  arcOptions: ArcClientOptions;

  defaultMessages: Required<MessageOptions>;

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

    this.defaultMessages = Object.assign<Required<MessageOptions>, MessageOptions | undefined>({
      error: (errId?: string) => {
        return {
          embeds: [
            new EmbedBuilder()
              .setTitle("Internal Error.")
              .setColor("Orange")
              .setDescription(`A internal error happen, error id ${errId}, please contact bot owner if error repeat`),
          ],
        };
      },
      missingPermissions: (permissionsMissing: PermissionsString[]) => {
        return {
          embeds: [
            new EmbedBuilder()
              .setTitle("Bot missing permissions")
              .setDescription(`The bot missing permissions : \`${permissionsMissing.join("`, `")}\``)
              .setColor("Orange"),
          ],
        };
      },
      devOnly: {
        embeds: [
          new EmbedBuilder()
            .setTitle("Reserved to Developer")
            .setDescription("This command is reserved for bot developers")
            .setColor("Red"),
        ],
      },
      authorOnly: {
        embeds: [
          new EmbedBuilder()
            .setTitle("Author Only")
            .setDescription("This command is reserved for author of interaction")
            .setColor("Orange"),
        ],
      },
    }, options.baseMessages && "default" in options.baseMessages ? options.baseMessages.default : options.baseMessages);

    this.arcOptions = options;
    this.devManager = new DevManager(this);
    this.commandManager = new CommandManager(this);
    this.taskManager = new TaskManager(this);

    this.eventManager = new EventManager(this);

    this.componentManager = new ComponentManager(this);

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

  async loadCommands(commands: CommandDefinition[], group = "default", guild?: string): Promise<void> {
    const data = this.commandManager.loadCommands(commands, group);
    let data2;
    if (guild) {
      data2 = await this.commandManager.pushGuildCommands(guild, data);
    } else {
      data2 = await this.commandManager.pushGlobalCommands(data);
    }
    this.commandManager.resolveCommands(commands, data2);

    return;
  }

  loadEvents(events: EventHandler[]) {
    return this.eventManager.loadEvents(events);
  }

  loadTasks(tasks: Task[]) {
    return this.taskManager.loadTasks(tasks);
  }

  loadComponents(components: ComponentProps[]) {
    return this.componentManager.loadComponents(components);
  }

}