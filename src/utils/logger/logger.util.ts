import type { LogLevel } from "#/utils/logger/logger.type";
import { effectReset } from "tintify";
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
  SPACE_FILLER
} from "#/utils/logger/logger.const";
import { DayJS } from "#/utils/dayjs/dayjs";
import type { DebugValueString } from "#/utils/error/error.type";

export const formatLog = (logLevel: LogLevel, message: string, processName = "main"): string => {
  const reset = effectReset.all;
  const options = logLevelInfos[logLevel];

  const date = DayJS().format("YYYY-MM-DD HH:mm:ss");

  if (processName.length > MAX_PROCESS_LENGTH) {
    processName = processName.slice(0, MAX_PROCESS_LENGTH);
  } else if (processName.length < MAX_PROCESS_LENGTH) {
    processName = processName.padEnd(MAX_PROCESS_LENGTH, SPACE_FILLER);
  }


  const prefix = `${reset}${DATE_COLOR}[${date}] ${reset}${PROCESS_NAME_COLOR}${processName}`;
  const middle = `${reset} ${SEPARATOR_COLOR}[${options.titleColor}${options.logText}${reset}${SEPARATOR_COLOR}]`;
  const separator = `${reset} ${SEPARATOR_COLOR}${"-".repeat(MAX_TITLE_LENGTH - options.logText.length)} » `;
  const text = `${reset}${options.textColor}${message}`;

  return prefix + middle + separator + text;
};

export const colorDebugValue = (debug: DebugValueString): string => {
  const reset = effectReset.all;
  return `${reset}${DEBUG_KEY_COLOR}${debug[0]} : ${reset}${DEBUG_VALUE_COLOR}${debug[1]}`;
};

export const formatShortDebug = (message: string|DebugValueString): string => {
  if (typeof message !== "string") {
    message = colorDebugValue(message);
  }

  const options = logLevelInfos["debug"];
  const reset = effectReset.all;

  const prefix = `${reset}${SEPARATOR_COLOR}${" ".repeat(SHORT_DEBUG_SPACING)}${SHORT_DEBUG_PREFIX}`;
  const middle = `[${reset}${options.titleColor}${options.logText}${reset}${SEPARATOR_COLOR}]`;
  const separator = `${reset} ${SEPARATOR_COLOR}${"-".repeat(MAX_TITLE_LENGTH - options.logText.length)} » `;
  const text = `${reset}${options.textColor}${message}`;

  return prefix + middle + separator + text;
};