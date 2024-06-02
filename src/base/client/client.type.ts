import { ClientOptions } from "discord.js";
import { LoggerConstructor } from "#/utils/logger/logger.type";

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
 * Represents options for an ArcClient.
 */
export type ArcClientOptions = ClientOptions & {

  /**
   * Options for configuring the logger.
   */
  logger?: ArcClientLoggerOptions;
}