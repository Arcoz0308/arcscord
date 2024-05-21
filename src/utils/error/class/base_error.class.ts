import type { DebugValues, DebugValueString, ErrorOptions } from "#/utils/error/error.type";
import { stringifyDebugValue } from "#/utils/error/error.util";
import ShortUniqueId from "short-unique-id";

export class BaseError extends Error {

  origin?: BaseError|Error;

  debugs?: DebugValues;

  id?: string;

  constructor(options: ErrorOptions) {
    super(options.message);

    this.name = "BaseError";

    this.origin = options.baseError;
    this.debugs = options.debugs;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];

    if (this.id) {
      debugs.push(["id", this.id]);
    }

    if (this.debugs) {
      for (const [key, value] of Object.entries(this.debugs)) {
        debugs.push(stringifyDebugValue(key, value));
      }
    }

    if (this.stack) {
      let i = 1;
      for (const stack of this.stack.split("\n")) {
        debugs.push([`stack ${i}.`, stack.trim()]);

        i++;
      }
    }

    if (this.origin) {

      if (this.origin instanceof BaseError) {
        debugs.push(["originError", this.origin.fullMessage()]);
        debugs.push(...this.origin.getDebugsString());
      } else {
        debugs.push(["originError", this.origin.message]);
        if (this.origin.stack) {
          let i = 1;
          for (const stack of this.origin.stack.split("\n")) {
            debugs.push([`stack ${i}.`, stack.trim()]);

            i++;
          }
        }
      }
    }

    return debugs;
  }

  generateId(): this {
    this.id = new ShortUniqueId().stamp(16);
    return this;
  }

  fullMessage(): string {
    return `${this.name}: ${this.message}`;
  }

}