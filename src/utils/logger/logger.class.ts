import type { LogLevel } from "#/utils/logger/logger.type";
import { colorDebugValue, formatLog, formatShortDebug } from "#/utils/logger/logger.util";
import * as process from "process";
import type { DebugValueString } from "#/utils/error/error.type";


export class Logger {

  processName: string;

  // if you want to change logger
  loggerFunction: (...data: unknown[]) => void = console.log;

  constructor(name: string) {
    this.processName = name;
  }

  trace(message: string): void {
    this.log("trace", message);
  }

  debug(message: string|DebugValueString): void {
    if (typeof message === "string") {
      this.log("debug", message);
    } else {
      this.log("debug", colorDebugValue(message));
    }
  }

  info(message: string): void {
    this.log("info", message);
  }

  warning(message: string): void {
    this.log("warning", message);
  }

  error(message: string, debugs: (string|DebugValueString)[] = []): void {
    this.log("error", message);
    for (const debug of debugs) {
      this.loggerFunction(formatShortDebug(debug));
    }
  }

  fatal(message: string): never {
    this.log("fatal", message);
    return process.exit(1);
  }

  log(level: LogLevel, message: string): void {
    this.loggerFunction(formatLog(level, message, this.processName));
  }

}

export const logger = new Logger("main");