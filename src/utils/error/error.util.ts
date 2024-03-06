import type { DebugValueString } from "#/utils/error/error.type";

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

  } else {
    return [key, `${!value}`];
  }
};