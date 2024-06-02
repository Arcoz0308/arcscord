import type { logLevels } from "#/utils/logger/logger.enum";
import type { DebugValues, DebugValueString } from "#/utils/error/error.type";
import type { BaseError } from "#/utils/error/class/base_error";

export type LogLevelInfo = {
  logText: string;
  titleColor: string;
  textColor: string;
  logPriority: number;
}

export type LogLevel = keyof typeof logLevels;

export type LogFunc = (...data: unknown[]) => void;

export type LoggerInterface = {

  trace: (message: string) => void;

  debug: (message: string | DebugValueString) => void;

  info: (message: string) => void;

  warning: (message: string) => void;

  error: (message: string, debugs?: (string | DebugValueString)[] | DebugValues) => void;

  logError: (error: BaseError) => void;

  fatal: (message: string, debugs?: (string | DebugValueString)[] | DebugValues) => never;

  log: (level: LogLevel, message: string) => void;
}

export type LoggerConstructor = {
  new (name: string, logFunc?: LogFunc): LoggerInterface;
}