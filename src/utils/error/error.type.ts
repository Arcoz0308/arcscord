import type { BaseError } from "#/utils/error/class/base_error.class";

export type ErrorOptions = {
  message?: string;
  baseError?: BaseError|Error;
  debugs?: DebugValues;
}

export type DebugValues = {[key: string]: unknown};
export type DebugValueString = [key: string, value: string];