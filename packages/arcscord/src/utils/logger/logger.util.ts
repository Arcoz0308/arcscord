import type { DebugValueString } from "#/utils/error/error.type";
import type { LogFunc, LoggerConstructor, LoggerInterface, LogLevel } from "#/utils/logger/logger.type";
import { DayJS } from "#/utils/dayjs/dayjs";
import {
  DATE_COLOR,
  DEBUG_KEY_COLOR,
  DEBUG_VALUE_COLOR,
  logLevelInfos,
  MAX_PROCESS_LENGTH,
  MAX_TITLE_LENGTH,
  PROCESS_NAME_COLOR,
  SEPARATOR_COLOR,
  SHORT_DEBUG_PREFIX,
  SHORT_DEBUG_SPACING,
  SPACE_FILLER,
} from "#/utils/logger/logger.const";
import { effectReset } from "tintify";

export function formatLog(
  logLevel: LogLevel,
  message: string,
  processName = "main",
): string {
  const reset = effectReset.all;
  const options = logLevelInfos[logLevel];

  const date = DayJS().format("YYYY-MM-DD HH:mm:ss");

  if (processName.length > MAX_PROCESS_LENGTH) {
    processName = processName.slice(0, MAX_PROCESS_LENGTH);
  }
  else if (processName.length < MAX_PROCESS_LENGTH) {
    processName = processName.padEnd(MAX_PROCESS_LENGTH, SPACE_FILLER);
  }

  const prefix = `${reset}${DATE_COLOR}[${date}] ${reset}${PROCESS_NAME_COLOR}${processName}`;
  const middle = `${reset} ${SEPARATOR_COLOR}[${options.titleColor}${options.logText}${reset}${SEPARATOR_COLOR}]`;
  const separator = `${reset} ${SEPARATOR_COLOR}${"-".repeat(MAX_TITLE_LENGTH - options.logText.length)} » `;
  const text = `${reset}${options.textColor}${message}`;

  return prefix + middle + separator + text;
}

export function colorDebugValue([key, value]: DebugValueString): string {
  const reset = effectReset.all;
  return `${reset}${DEBUG_KEY_COLOR}${key} : ${reset}${DEBUG_VALUE_COLOR}${value}`;
}

export function formatShortDebug(message: string | DebugValueString): string {
  if (typeof message !== "string") {
    message = colorDebugValue(message);
  }

  const options = logLevelInfos.debug;
  const reset = effectReset.all;

  const prefix = `${reset}${SEPARATOR_COLOR}${" ".repeat(SHORT_DEBUG_SPACING)}${SHORT_DEBUG_PREFIX}`;
  const middle = `[${reset}${options.titleColor}${options.logText}${reset}${SEPARATOR_COLOR}]`;
  const separator = `${reset} ${SEPARATOR_COLOR}${"-".repeat(MAX_TITLE_LENGTH - options.logText.length)} » `;
  const text = `${reset}${options.textColor}${message}`;

  return prefix + middle + separator + text;
}

/**
 * Creates a new logger instance using the provided constructor function.
 *
 * @param constructorFunc - The constructor function to create the logger instance.
 * @param name - The name to be assigned to the logger.
 * @param logFunc - Optional custom logging function. If not provided, defaults to `console.log`.
 * @return - The created logger instance.
 */
export function createLogger(
  constructorFunc: LoggerConstructor,
  name: string,
  logFunc?: LogFunc,
): LoggerInterface {
  // eslint-disable-next-line no-console,new-cap
  return new constructorFunc(name, logFunc || console.log);
}
