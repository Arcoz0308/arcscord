import type { Result } from "./type";
import { anyToError } from "./util";

/**
 * Represents a function that wraps a value in a Result  with a success status.
 *
 * @param {T} value - The value to be wrapped.
 * @returns {Result<T, E>} - The Result object with success status and wrapped value.
 * @template T - The type of value to be wrapped.
 * @template E - The type of error for the Result.
 */
export const ok = <T, E>(value: T): Result<T, E> => {
  return [
    value,
    null,
  ];
};

/**
 * Represents an error result.
 *
 * @param {E} err - The error value.
 * @returns {Result<T, E>} - The error result.
 * @template T The type of the value that should have been returned if there was no error.
 * @template E The type of the error.
 */
export const error = <T, E>(err: E): Result<T, E> => {
  return [
    null,
    err,
  ];
};


/**
 * A function that executes a given function and returns a Result  wrapping the result or an error.
 *
 * @param {Function} fn - The function to be executed.
 * @returns {Promise<Result<T, Error>>} - A promise that resolves to a Result.
 * @template T - The type of the result value.
 */
export const forceSafe = async <T>(fn: (...args: unknown[]) => T | Promise<T>): Promise<Result<T, Error>>  => {
  try {
    const result = await fn();

    return ok(result);
  } catch (e) {
    return error(anyToError(e));
  }
};