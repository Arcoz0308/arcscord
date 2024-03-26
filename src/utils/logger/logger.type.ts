import type { logLevels } from "#/utils/logger/logger.enum";

export type LogLevelInfo = {
  logText: string;
  titleColor: string;
  textColor: string;
}

export type LogLevel = keyof typeof logLevels