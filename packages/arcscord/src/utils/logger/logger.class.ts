import type { DebugValues, DebugValueString } from "#/utils/error/error.type";
import type { LogFunc, LoggerInterface, LogLevel } from "#/utils/logger/logger.type";
import type { BaseError } from "@arcscord/better-error";
import * as process from "node:process";
import { stringifyDebugValues } from "#/utils";
import { colorDebugValue, formatLog, formatShortDebug } from "#/utils/logger/logger.util";

export class ArcLogger implements LoggerInterface {
  processName: string;

  // if you want to change logger
  loggerFunction: LogFunc;

  // eslint-disable-next-line no-console
  constructor(name: string, loggerFunction: LogFunc = console.log) {
    this.processName = name;
    this.loggerFunction = loggerFunction;
  }

  trace(message: string): void {
    if (process.argv.includes("debug")) {
      this.log("trace", message);
    }
  }

  debug(message: string | DebugValueString): void {
    if (typeof message === "string") {
      this.log("debug", message);
    }
    else {
      this.log("debug", colorDebugValue(message));
    }
  }

  info(message: string): void {
    this.log("info", message);
  }

  warning(message: string): void {
    this.log("warning", message);
  }

  error(
    message: string,
    debugs: (string | DebugValueString)[] | DebugValues = [],
  ): void {
    this.log("error", message);

    if (!Array.isArray(debugs)) {
      debugs = stringifyDebugValues(debugs);
    }

    for (const debug of debugs) {
      this.loggerFunction(formatShortDebug(debug));
    }
  }

  logError(error: BaseError): void {
    this.error(error.fullMessage(), error.getDebugString());
  }

  fatal(
    message: string,
    debugs: (string | DebugValueString)[] | DebugValues = [],
  ): never {
    this.log("fatal", message);

    if (!Array.isArray(debugs)) {
      debugs = stringifyDebugValues(debugs);
    }

    for (const debug of debugs) {
      this.loggerFunction(formatShortDebug(debug));
    }
    return process.exit(1);
  }

  fatalError(error: BaseError): never {
    this.fatal(error.fullMessage(), error.getDebugString());
  }

  log(level: LogLevel, message: string): void {
    this.loggerFunction(formatLog(level, message, this.processName));
  }
}

/**
 * Have a default logger easy to use
 *
 * Don't are changed with options in client, always ArcLogger with console.log
 */
export const defaultLogger = new ArcLogger("main");
