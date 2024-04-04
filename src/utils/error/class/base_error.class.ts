import type { DebugValues, DebugValueString, ErrorOptions } from "#/utils/error/error.type";
import { stringifyDebugValue } from "#/utils/error/error.util";

export class BaseError extends Error {

  origin?: BaseError|Error;

  debugs?: DebugValues;

  constructor(options: ErrorOptions) {
    super(options.message);

    this.origin = options.baseError;
    this.debugs = options.debugs;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];

    if (this.debugs) {
      for (const [key, value] of Object.entries(this.debugs)) {
        debugs.push(stringifyDebugValue(key, value));
      }
    }
    if (this.origin) {
      debugs.push(["originError", this.origin.message]);
      if (this.origin instanceof BaseError) {
        debugs.push(...this.origin.getDebugsString());
      }
    }
    return debugs;
  }

}