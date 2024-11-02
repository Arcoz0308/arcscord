import type { TaskHandler } from "#/base";
import type { ArcClientOptions, MessageOptions } from "#/base/client/client.type";
import type { Command } from "#/base/command/command_definition.type";
import type { ComponentHandler } from "#/base/components/component_handlers.type";
import type { EventHandler } from "#/base/event/event.type";
import type { Locale } from "#/utils";
import type { LoggerConstructor, LoggerInterface } from "#/utils/logger/logger.type";
import type { BaseMessageOptions, BitFieldResolvable, GatewayIntentsString, PermissionsString } from "discord.js";
import { ComponentManager } from "#/manager";
import { CommandManager } from "#/manager/command/command_manager.class";
import { EventManager } from "#/manager/event/event_manager.class";
import { LocaleManager } from "#/manager/locale/locale_manager.class";
import { TaskManager } from "#/manager/task/task_manager";
import { ArcLogger } from "#/utils/logger/logger.class";
import { createLogger } from "#/utils/logger/logger.util";
import { Client as DJSClient, EmbedBuilder, REST } from "discord.js";

export class ArcClient extends DJSClient {
  /**
   * The manager for commands
   */
  commandManager: CommandManager;

  /**
   * The manager for events
   */
  eventManager: EventManager;

  /**
   * The manager for tasks
   */
  taskManager: TaskManager;

  /**
   * The manager for components
   */
  componentManager: ComponentManager;

  /**
   * The manager for localization
   */
  localeManager: LocaleManager;

  /**
   * The logger instance
   */
  logger: LoggerInterface;

  /**
   * REST handler for Discord API
   */
  rest: REST;

  /**
   * Indicates if the client is ready
   */
  ready = false;

  /**
   * Additional options for configuring the client
   */
  arcOptions: ArcClientOptions;

  /**
   * Default messages for various operations
   */
  defaultMessages: Required<MessageOptions>;

  /**
   * Localized messages for various operations
   */
  localesMessages: Partial<Record<Locale | "default", MessageOptions>>;

  /**
   * Constructor function for the logger
   */
  loggerConstructor: LoggerConstructor;

  /**
   * Constructor for creating an instance of the ArcClient class.
   *
   * @param token - The authentication token for the bot.
   * @param options - Additional options for configuring the client.
   */
  constructor(token: string, options: ArcClientOptions) {
    super(options);

    this.loggerConstructor = options.logger?.customLogger ?? ArcLogger;

    this.defaultMessages = Object.assign<
      Required<MessageOptions>,
      MessageOptions | undefined
    >(
      {
        error: (errId?: string) => {
          return {
            embeds: [
              new EmbedBuilder()
                .setTitle("Internal Error.")
                .setColor("Orange")
                .setDescription(
                  `A internal error happen, error id ${errId}, please contact bot owner if error repeat`,
                ),
            ],
          };
        },
        missingPermissions: (permissionsMissing: PermissionsString[]) => {
          return {
            embeds: [
              new EmbedBuilder()
                .setTitle("Bot missing permissions")
                .setDescription(
                  `The bot missing permissions : \`${permissionsMissing.join("`, `")}\``,
                )
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
      },
      options.baseMessages && "default" in options.baseMessages
        ? options.baseMessages.default
        : options.baseMessages,
    );

    if (options.baseMessages && "default" in options.baseMessages) {
      this.localesMessages = options.baseMessages;
    }
    else {
      this.localesMessages = {};
    }

    this.arcOptions = { autoIntents: false, ...options };

    this.commandManager = new CommandManager(this);
    this.taskManager = new TaskManager(this);
    this.eventManager = new EventManager(this);
    this.componentManager = new ComponentManager(this);
    this.localeManager = new LocaleManager(this, options.managers?.locale);

    this.logger = createLogger(
      this.loggerConstructor,
      "main",
      options.logger?.loggerFunc,
    );

    this.token = token;

    this.rest = new REST({
      version: "10",
    }).setToken(token);

    this.on("ready", () => {
      this.ready = true;
      this.logger.info("bot connected...");
    });
  }

  /**
   * Waits until the client is ready
   *
   * @param delay - The delay in milliseconds between each check
   * @returns A promise that resolves when the client is ready
   */
  waitReady(delay = 50): Promise<void> {
    return new Promise((resolve) => {
      if (this.ready) {
        return resolve();
      }

      setTimeout(() => {
        if (this.ready) {
          return resolve();
        }

        // delay : 0.05s, 0.1s, 0.2s 0.4s, 0.8s, 0.5s, 1s, and repeat infinity last two
        return this.waitReady(delay <= 500 ? delay * 2 : 500);
      }, delay);
    });
  }

  /**
   * Creates a new logger instance with the provided name
   *
   * @param name - The name for the logger
   * @returns A new logger instance
   */
  createLogger(name: string): LoggerInterface {
    return createLogger(
      this.loggerConstructor,
      name,
      this.arcOptions.logger?.loggerFunc,
    );
  }

  /**
   * Loads and registers commands
   *
   * @param commands - The commands to load
   * @param group - The group to assign the commands to
   * @param guild - The guild to register the commands in (optional)
   */
  async loadCommands(
    commands: Command[],
    group = "default",
    guild?: string,
  ): Promise<void> {
    const data = this.commandManager.loadCommands(commands, group);
    let data2;
    if (guild) {
      data2 = await this.commandManager.pushGuildCommands(guild, data);
    }
    else {
      data2 = await this.commandManager.pushGlobalCommands(data);
    }
    this.commandManager.resolveCommands(commands, data2);
  }

  /**
   * Loads and registers events
   *
   * @param events - The events to load
   */
  loadEvents(events: EventHandler[]): void {
    return this.eventManager.loadEvents(events);
  }

  /**
   * Loads and registers tasks
   *
   * @param tasks - The tasks to load
   */
  loadTasks(tasks: TaskHandler[]): void {
    return this.taskManager.loadTasks(tasks);
  }

  /**
   * Loads and registers components
   *
   * @param components - The components to load
   */
  loadComponents(components: ComponentHandler[]): void {
    return this.componentManager.loadComponents(components);
  }

  /**
   * Gets an error message with a specified error ID and locale
   *
   * @param errorId - The ID of the error
   * @param locale - The locale for the error message (optional)
   * @returns The error message
   */
  getErrorMessage(errorId?: string, locale?: Locale): BaseMessageOptions {
    if (locale && this.localesMessages[locale]?.error) {
      return this.localesMessages[locale].error(errorId);
    }
    return this.defaultMessages.error(errorId);
  }

  /**
   * Gets a message for missing permissions
   *
   * @param permissionsMissing - The permissions that are missing
   * @param locale - The locale for the message (optional)
   * @returns The message for missing permissions
   */
  getMissingPermissionsMessage(permissionsMissing: PermissionsString[], locale?: Locale): BaseMessageOptions {
    if (locale && this.localesMessages[locale]?.missingPermissions) {
      return this.localesMessages[locale].missingPermissions(permissionsMissing);
    }
    return this.defaultMessages.missingPermissions(permissionsMissing);
  }

  /**
   * Gets a message indicating the command is for developers only
   *
   * @param locale - The locale for the message (optional)
   * @returns The developer-only message
   */
  getDevOnlyMessage(locale?: Locale): BaseMessageOptions {
    if (locale && this.localesMessages[locale]?.devOnly) {
      return this.localesMessages[locale].devOnly;
    }
    return this.defaultMessages.devOnly;
  }

  addIntents(intents: BitFieldResolvable<GatewayIntentsString, number>): void {
    this.options.intents = this.options.intents.add(intents);
  }
}
