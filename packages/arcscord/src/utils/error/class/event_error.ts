import type { EventHandler } from "#/base/event/event.type";
import type { ErrorOptions } from "@arcscord/better-error";
import { BaseError } from "@arcscord/better-error";

export type EventErrorOptions = ErrorOptions & {
  handler: EventHandler;
};

export class EventError extends BaseError {
  handler: EventHandler;

  constructor(options: EventErrorOptions) {
    super(options);

    this.name = "EventError";

    this.handler = options.handler;

    this._debugs.set("eventType", options.handler.event);
    this._debugs.set("handlerName", options.handler.name);
  }
}
