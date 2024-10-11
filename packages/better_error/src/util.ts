import process from "node:process";

/**
 * make a proper string from unknown value
 */
export function stringifyUnknown(value: unknown): string {
  try {
    switch (typeof value) {
      case "string": {
        return `"${value}"`;
      }

      case "number": {
        return value.toString(10);
      }

      case "bigint": {
        return `${value.toString(10)}n`;
      }

      case "boolean": {
        return value ? "true" : "false";
      }

      case "function": {
        return value.toString();
      }

      case "undefined": {
        return "undefined";
      }

      case "object": {
        return JSON.stringify(value);
      }

      case "symbol": {
        return value.toString();
      }

      default: {
        if (value === null) {
          return "null";
        }
        return "unknown";
      }
    }
  }
  catch (e) {
    if (process.env?.DEBUG) {
      console.error("Failed to parse value into string");
      console.warn("Value : ", value);
      console.warn("Error : ", e);
    }
    return "unknown";
  }
}
