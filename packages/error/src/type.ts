/**
 * Represents a Result that encapsulates either a success value or an error value.
 *
 * @template T - The type of the success value.
 * @template E - The type of the error value.
 */
export type Result<T, E> = ResultOk<T> | ResultErr<E>;

/*
 * Represents a successful result with a value of type T.
 *
 * @template T - The type of the value.
 */
export type ResultOk<T> = [
  value: T,
  error: null,
];

/**
 * Represents a Result with an error.
 *
 * @template E - The type of error
 */
export type ResultErr<E> = [
  value: null,
  error: E,
];
