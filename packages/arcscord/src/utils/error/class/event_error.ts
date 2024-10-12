import type { EventHandler } from "#/base/event/event.type";
import type { ErrorOptions } from "@arcscord/better-error";
import { BaseError } from "@arcscord/better-error";

/**
 * Options for creating an EventError.
 */
export type EventErrorOptions = ErrorOptions & {
  /**
   * The event handler associated with the error.
   */
  handler: EventHandler;
};

/**
 * A custom error class for event handling errors.
 */
export class EventError extends BaseError {
  /**
   * The event handler associated with this error.
   */
  handler: EventHandler;

  /**
   * Creates a new instance of EventError.
   *
   * @param options - The options for creating the event error.
   */
  constructor(options: EventErrorOptions) {
    super(options);

    this.name = "EventError";

    this.handler = options.handler;

    this._debugs.set("eventType", options.handler.event);
    this._debugs.set("handlerName", options.handler.name);
  }
}
