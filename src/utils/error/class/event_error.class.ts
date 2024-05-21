import { BaseError } from "#/utils/error/class/base_error.class";
import type { DebugValueString, EventErrorOptions } from "#/utils/error/error.type";
import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";

export class EventError extends BaseError {

  event: Event<keyof ClientEvents>;

  constructor(options: EventErrorOptions) {
    super(options);

    this.name = "EventError";

    this.event = options.event;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];
    debugs.push(["eventName", this.event.event], ["handlerName", this.event.name]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}