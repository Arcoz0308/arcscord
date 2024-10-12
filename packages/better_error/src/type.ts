import type { BaseError } from "./base_error";

/**
 * Represents a collection of debug values
 */
export type Debugs = { [key: string]: unknown };

/**
 * Represents a debug object with value in string
 */
export type DebugStringObject = { [key: string]: string };

/**
 * Represents the options for creating an error.
 */
export type ErrorOptions = {
  /**
   * Represents the message of the error
   */
  message: string;
  /**
   * for set a custom name of the error
   * @defaultValue baseError
   */
  name?: string;

  /**
   * Represents the original error associated with an error.
   */
  originalError?: BaseError | Error;
  /**
   * Represents the debugging information for the error
   */
  debugs?: Debugs;

  /**
   * if an uuid v4 id need to be generated auto (ignored if customId given)
   * @defaultValue false
   */
  autoGenerateId?: boolean;
  /**
   * set a custom id for the error
   */
  customId?: string;
};

/**
 * Options for customise getDebugs output
 */
export type GetDebugOptions = {
  /**
   * If add the id in the debug object
   *
   * @defaultValue true
   */
  id?: boolean;

  /**
   * If add the debugs if exist from originals errors in the debug object
   *
   * @defaultValue true
   */
  originalErrorDebugs?: boolean | GetDebugOptions;

  /**
   * If add the stack in the debug
   *
   * @defaultValue true
   * @see {GetDebugOptions.stackFormat}
   */
  stack?: boolean;

  /**
   * The format of the stack output
   *
   *
   * _default - Without cut into one key "stack"_
   *
   * _split - format the stack, with remove the first line and count lines, with a new key-value for each line_
   * @defaultValue split
   */
  stackFormat?: StackFormat;

  /**
   * if add stack of original error (work with Error and BaseError extends)
   * @defaultValue true
   */
  originalErrorStack?: boolean;
};

/**
 * The format of output for stack
 *
 * `default` -> a single string
 * `split` -> an array of string for each line of the stack
 */
export type StackFormat = "default" | "split";
