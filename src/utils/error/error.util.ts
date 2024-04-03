import type { DebugValues, DebugValueString, Result } from "#/utils/error/error.type";
import { undefined } from "zod";

export const stringifyDebugValue = (key: string, value: unknown): DebugValueString => {
  if (typeof value === "string") {
    return [key, value];

  } else if (typeof value === "number" || typeof value === "bigint") {
    return [key, value.toString()];

  } else if (typeof value === "object" && value !== null) {
    if ("toJson" in value && typeof value.toJson === "function") {
      return [key, value.toJson()];
    } else {
      return [key, JSON.stringify(value)];
    }

  } else if (typeof value === "boolean") {
    return [key, value.toString()];

  } else if (value === undefined) {
    return [key, "undefined"];
  } else {
    return [key, `${!value}`];
  }
};

export const stringifyDebugValues = (debug: DebugValues): DebugValueString[] => {

  return Object.entries(debug).map(([key, value]) => stringifyDebugValue(key, value));

};

export const ok = <T, E>(value: T): Result<T, E> => {
  return [value, true];
};

export const error = <T, E>(error: E): Result<T, E> => {
  return [error, false];
};

export const anyToError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  }

  if (typeof e === "string") {
    return new Error(e);
  }

  return new Error(String(e));
};