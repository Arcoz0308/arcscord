import { ClientOptions } from "discord.js";
import { LoggerConstructor } from "#/utils/logger/logger.type";

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
  logger?: LoggerConstructor;
}

export type ArcClientOptions = ClientOptions & {

}