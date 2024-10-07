/**
 * Converts any value to an Error object.
 *
 * @param {unknown} obj - The value to be converted.
 * @returns {Error} - The converted Error object.
 */
export function anyToError(obj: unknown): Error {
  if (obj instanceof Error) {
    return obj;
  }
  if (typeof obj === "string") {
    return new Error(obj);
  }

  if (typeof obj === "object") {
    return new Error(JSON.stringify(obj));
  }
  return new Error(String(obj));
}
