import type { DebugValues, DebugValueString } from "#/utils/error/error.type";
import type { logLevels } from "#/utils/logger/logger.enum";
import type { BaseError } from "@arcscord/better-error";

/**
 * @internal
 */
export type LogLevelInfo = {
  logText: string;

  titleColor: string;

  textColor: string;

  logPriority: number;
};

/**
 * The type representing the log levels.
 */
export type LogLevel = keyof typeof logLevels;

/**
 * Function type for logging, which accepts any data to be logged.
 */
export type LogFunc = (...data: unknown[]) => void;

/**
 * Constructor type for creating a LoggerInterface.
 */
export type LoggerConstructor = {
  new(name: string, logFunc?: LogFunc): LoggerInterface;
};

/**
 * Interface representing a logger with various logging methods.
 */
export type LoggerInterface = {
  /**
   * Logs a trace message.
   * @param message - The message to be logged.
   */
  trace: (message: string) => void;

  /**
   * Logs a debug message.
   * @param message - The message or a key-value pair to be logged.
   */
  debug: (message: string | DebugValueString) => void;

  /**
   * Logs an informational message.
   * @param message - The message to be logged.
   */
  info: (message: string) => void;

  /**
   * Logs a warning message.
   * @param message - The message to be logged.
   */
  warning: (message: string) => void;

  /**
   * Logs an error message.
   * @param message - The message to be logged.
   * @param debugs - Optional debug values to include.
   */
  error: (
    message: string,
    debugs?: (string | DebugValueString)[] | DebugValues
  ) => void;

  /**
   * Logs an error object.
   * @param error - The error to be logged.
   */
  logError: (error: BaseError) => void;

  /**
   * Logs a fatal message and halts execution.
   * @param message - The message to be logged.
   * @param debugs - Optional debug values to include.
   */
  fatal: (
    message: string,
    debugs?: (string | DebugValueString)[] | DebugValues
  ) => never;

  /**
   * Logs a fatal error and halts execution.
   * @param error - The error to be logged.
   */
  fatalError: (error: BaseError) => never;

  /**
   * Logs a message at the specified log level.
   * @param level - The log level.
   * @param message - The message to be logged.
   */
  log: (level: LogLevel, message: string) => void;
};
