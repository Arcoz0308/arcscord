import type { LogLevel, LogLevelInfo } from "#/utils/logger/logger.type";
import { brightForground, forground, forground256Color } from "tintify";

export const logLevelInfos: Record<LogLevel, LogLevelInfo> = {
  fatal: {
    logText: "FATAL",
    titleColor: brightForground.red,
    textColor: forground.red,
    logPriority: 1,
  },
  error: {
    logText: "ERROR",
    titleColor: forground256Color(208),
    textColor: forground256Color(255),
    logPriority: 2,
  },
  warning: {
    logText: "WARNING",
    titleColor: forground256Color(220),
    textColor: forground256Color(255),
    logPriority: 3,
  },
  info: {
    logText: "INFO",
    titleColor: brightForground.green,
    textColor: forground256Color(252),
    logPriority: 4,
  },
  debug: {
    logText: "DEBUG",
    titleColor: forground256Color(245),
    textColor: forground256Color(247),
    logPriority: 5,
  },
  trace: {
    logText: "TRACE",
    titleColor: forground256Color(245),
    textColor: forground256Color(247),
    logPriority: 6,
  },
};

export const DATE_COLOR = forground.white;
export const SEPARATOR_COLOR = forground256Color(240);

export const MAX_TITLE_LENGTH = 8;
export const MAX_PROCESS_LENGTH = 10;

export const SPACE_FILLER = " ";
export const PROCESS_NAME_COLOR = forground256Color(57);

export const DEBUG_KEY_COLOR = forground256Color(33);
export const DEBUG_VALUE_COLOR = forground256Color(75);

export const SHORT_DEBUG_SPACING = 33;
export const SHORT_DEBUG_PREFIX = "↳ ";