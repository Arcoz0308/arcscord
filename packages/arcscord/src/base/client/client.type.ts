import type { BaseMessageOptions, ClientOptions, PermissionsString } from "discord.js";
import type { LoggerConstructor } from "#/utils/logger/logger.type";
import type { Locale } from "#/utils/discord/type/locale.type";

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
   * @default ArcLogger
   */
  customLogger?: LoggerConstructor;
}

/**
 * Represents the developer options for the ArcClient.
 */
export type ArcClientDevOptions = {
  /**
   * used for load global command in a guild
   * @warning Only commands loaded with CommandManager.loadGlobalCommands() are affected with this one !
   */
  devGuild: string;

  /**
   * Whether the feature is enabled or not.
   * recommended to use it with a command arg
   * @default true
   * @example ```ts
   * enabled = process.argv.includes("dev");
   * ```
   */
  enabled?: boolean;

  /**
   * If you want to use arcscord dev manager !
   */
  devManager?: boolean;

  /**
   * file path where the developer config are
   */
  devFilePath?: string;
}

/**
 * Represents options for an ArcClient.
 */
export type ArcClientOptions = ClientOptions & {

  /**
   * Options for configuring the logger.
   */
  logger?: ArcClientLoggerOptions;

  /**
   * Options for configuring dev mode
   */
  dev?: ArcClientDevOptions;

  developers?: string[];

  baseMessages?: MessageOptions | (
    Partial<Record<Locale, MessageOptions>> & {
    default: MessageOptions;
  });

  applicationId?: string;
}

export type MessageOptions = {
  error?: (errId: string) => BaseMessageOptions;
  devOnly?: MessageDefiner;
  missingPermissions?: (permissionsMissing: PermissionsString[]) => BaseMessageOptions;
}

export type MessageDefiner = BaseMessageOptions;