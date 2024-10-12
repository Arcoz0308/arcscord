import type { Debugs, DebugStringObject, ErrorOptions, GetDebugOptions, StackFormat } from "./type";
import { stringifyUnknown } from "./util";

/**
 * A custom error class
 */
export class BaseError extends Error {
  /**
   * The name of the error
   */
  name = "baseError";

  protected _debugs: Map<string, unknown> = new Map();

  /**
   * Creates a new instance of the error class.
   *
   * @param opt - The options for creating the error.
   */
  constructor(opt: string | ErrorOptions) {
    super(typeof opt === "string" ? opt : opt.message);

    if (typeof opt === "object") {
      if (opt.name) {
        this.name = opt.name;
      }

      this._originalError = opt.originalError;

      const debugs = opt.debugs;
      if (debugs) {
        for (const [key, value] of Object.entries(debugs)) {
          this._debugs.set(key, value);
        }
      }

      if (opt.customId) {
        this._id = opt.customId;
      }
      else if (opt.autoGenerateId) {
        this.generateId();
      }
    }
  }

  protected _originalError?: BaseError | Error;

  /**
   * Returns the original error associated with this error.
   *
   * @returns The original error, if available; otherwise, undefined.
   */
  get originalError(): BaseError | Error | undefined {
    return this._originalError;
  }

  protected _id?: string;

  /**
   * Retrieves the error id
   *
   * @returns The id of the error, or undefined if it does not have an id.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Sets the error id value.
   *
   * @param value - The ID value to be set.
   */
  set id(value: string) {
    this._id = value;
  }

  /**
   * Generates a unique identifier for an object.
   *
   * @returns The current object with the generated identifier.
   */
  generateId(): this {
    this._id = crypto.randomUUID();
    return this;
  }

  /**
   * Retrieves the debug information as an object.
   *
   * @param options - An optional parameter to customize the debug object.
   * @returns The debugs object with the retrieved debug information.
   */
  getDebugsObject(options: GetDebugOptions = {}): Debugs {
    options = Object.assign(this.defaultGetDebugOptions(), options);

    let debugs: Debugs = {};
    if (options.id) {
      debugs.errorId = this._id || "no_id";
    }

    debugs = Object.assign(debugs, Object.fromEntries(this._debugs));

    if (options.stack) {
      debugs = Object.assign(debugs, this.getStack(options.stackFormat));
    }

    if (this._originalError) {
      if (this._originalError instanceof BaseError) {
        debugs.originalError = this._originalError.fullMessage();
        if (options.originalErrorDebugs !== false) {
          const originalOptions
            = typeof options.originalErrorDebugs === "object"
              ? options.originalErrorDebugs
              : options;

          for (const [key, value] of Object.entries(
            this._originalError.getDebugsObject(originalOptions),
          )) {
            debugs[`originalError - ${key}`] = value;
          }
        }
        else {
          if (options.originalErrorStack) {
            for (const [key, value] of Object.entries(
              this._originalError.getStack(options.stackFormat),
            )) {
              debugs[`originalError - ${key}`] = value;
            }
          }
        }
      }
      else {
        debugs.originalError
          = `${this._originalError.name}: ${this._originalError}`;

        if (options.originalErrorStack && this._originalError.stack) {
          for (const [key, value] of Object.entries(
            this.getStack(options.stackFormat, this._originalError.stack),
          )) {
            debugs[`originalError - ${key}`] = value;
          }
        }
      }
    }

    return debugs;
  }

  /**
   * Returns a string representation of the debug information for the current object.
   *
   * @param options - Optional configuration object for fetching specific debug information.
   * @returns An object containing stringifies debug information.
   */
  getDebugString(options: GetDebugOptions = {}): DebugStringObject {
    const debugs = this.getDebugsObject(options);
    const newDebug: DebugStringObject = {};

    for (const [key, value] of Object.entries(debugs)) {
      newDebug[key] = stringifyUnknown(value);
    }

    return newDebug;
  }

  /**
   * Retrieves the stack information in the specified format.
   *
   * @param stackFormat The format of the stack information. Defaults to "split".
   * @param stacks The stack information to be retrieved. If not provided, it will use the stack information of the current instance.
   *
   * @returns The stack information in the defined format.
   */
  getStack(
    stackFormat: StackFormat = "split",
    stacks?: string,
  ): DebugStringObject {
    if (!stacks) {
      stacks = this.stack;
    }

    if (!stacks) {
      return {};
    }

    if (stackFormat === "default") {
      return {
        stack: stacks,
      };
    }

    const stackObj: DebugStringObject = {};
    let i: number = 1;
    for (const stack of stacks.split("\n").slice(1)) {
      stackObj[`stack${i}`] = stack.trim();
      i++;
    }
    return stackObj;
  }

  /**
   * Returns the default debug options for a debug session.
   *
   * @returns The default debug options as an object
   */
  defaultGetDebugOptions(): Required<GetDebugOptions> {
    return {
      id: true,
      originalErrorDebugs: true,
      stack: true,
      stackFormat: "split",
      originalErrorStack: true,
    };
  }

  /**
   * Returns the full message, which includes the name of the object concatenated with the message.
   * The message is returned as a string.
   *
   * @returns The full message, combining the name and the message.
   */
  fullMessage(): string {
    return `${this.name}: ${this.message}`;
  }
}
