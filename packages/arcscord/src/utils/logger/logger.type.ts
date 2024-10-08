import type { DebugValues, DebugValueString } from "#/utils/error/error.type";
import type { logLevels } from "#/utils/logger/logger.enum";
import type { BaseError } from "@arcscord/better-error";

export type LogLevelInfo = {
  logText: string;
  titleColor: string;
  textColor: string;
  logPriority: number;
};

export type LogLevel = keyof typeof logLevels;

export type LogFunc = (...data: unknown[]) => void;

export type LoggerConstructor = {
  new (name: string, logFunc?: LogFunc): LoggerInterface;
};

export type LoggerInterface = {
  trace: (message: string) => void;

  debug: (message: string | DebugValueString) => void;

  info: (message: string) => void;

  warning: (message: string) => void;

  error: (
    message: string,
    debugs?: (string | DebugValueString)[] | DebugValues,
  ) => void;

  logError: (error: BaseError) => void;

  fatal: (
    message: string,
    debugs?: (string | DebugValueString)[] | DebugValues,
  ) => never;

  fatalError: (error: BaseError) => never;

  log: (level: LogLevel, message: string) => void;
};
