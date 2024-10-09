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
   * @default ArcLogger
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

  developers?: string[];

  baseMessages?:
    | MessageOptions
    | (Partial<Record<Locale, MessageOptions>> & {
      default: MessageOptions;
    });

  applicationId?: string;
};

export type MessageOptions = {
  error?: (errId?: string) => BaseMessageOptions;
  devOnly?: BaseMessageOptions;
  missingPermissions?: (
    permissionsMissing: PermissionsString[],
  ) => BaseMessageOptions;
  authorOnly?: BaseMessageOptions;
};
