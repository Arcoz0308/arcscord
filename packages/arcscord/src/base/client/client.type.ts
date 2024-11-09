import type { LocaleManagerOptions } from "#/manager/locale/locale_manager.type";
import type { Locale } from "#/utils/discord/type/locale.type";
import type { LoggerConstructor } from "#/utils/logger/logger.type";
import type { BaseMessageOptions, ClientOptions, PermissionsString } from "discord.js";

/**
 * Represents the options for configuring the ArcClient Logger.
 */
export type ArcClientLoggerOptions = {
  /**
   * If you want to use another logger that console.log
   * @default console.log
   */
  loggerFunc?: (...data: unknown[]) => void;

  /**
   * Change the logger used by the framework, need a constructor, not a class !
   *
   * Only update logger builds in Client, defaultLogger don't are updated !
   * @default {@link ArcLogger}
   */
  customLogger?: LoggerConstructor;
};

/**
 * Represents options for an ArcClient.
 */
export type ArcClientOptions = ClientOptions & {
  /**
   * Options for configuring the logger.
   */
  logger?: ArcClientLoggerOptions;

  /**
   * list of developers discord ids
   */
  developers?: string[];

  /**
   * List of base messages, support locale soon
   */
  baseMessages?:
    | MessageOptions
    | (Partial<Record<Locale, MessageOptions>> & {
      default: MessageOptions;
    });

  /**
   * Indicates whether the intents for event should be detected by default.
   * @default false
   * @experimental
   */
  autoIntents?: boolean;

  /**
   * Optional configuration object for specifying manager options.
   * This can be used to customize behavior or settings related to managers.
   */
  managers?: ManagersOptions;

  /**
   * if you want the lib trace logs
   * @default process.env.NODE_ENV === "development" || process.argv.includes("dev")
   */
  enableInternalTrace?: boolean;
};

/**
 * configurations for arcscord managers
 */
export type ManagersOptions = {
  /**
   * Configuration of {@link LocaleManager} for customise localization of arcscord
   */
  locale?: LocaleManagerOptions;
};

/**
 * List of base options
 */
export type MessageOptions = {
  /**
   * Message if an internal error happen
   * @param errId the error id
   */
  error?: (errId?: string) => BaseMessageOptions;
  /**
   * Message if someone use a command that are reserved for dev
   * @see {@link CommandOptions.developerCommand}
   */
  devOnly?: BaseMessageOptions;
  /**
   * Message if bot missing some perms for execute a command
   * @param permissionsMissing the missing permissions for the execute the command
   * @see {@link CommandOptions.neededPermissions}
   */
  missingPermissions?: (
    permissionsMissing: PermissionsString[],
  ) => BaseMessageOptions;
};
