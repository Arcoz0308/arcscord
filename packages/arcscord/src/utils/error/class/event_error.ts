import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";
import type { ErrorOptions } from "@arcscord/better-error";
import { BaseError } from "@arcscord/better-error";

export type EventErrorOptions = ErrorOptions & {
  event: Event<keyof ClientEvents>;
}

export class EventError extends BaseError {

  event: Event<keyof ClientEvents>;

  constructor(options: EventErrorOptions) {
    super(options);

    this.name = "EventError";

    this.event = options.event;

    this._debugs.set("eventType", options.event.event);
    this._debugs.set("handlerName", options.event.name);
  }

}