import type { EventHandler } from "#/base/event/event.type";
import type { OptionalProperties } from "#/utils";
import type { ClientEvents } from "discord.js";

export function createEvent<E extends keyof ClientEvents>(
  options: OptionalProperties<EventHandler<E>, "name">,
): EventHandler {
  if (!options.name) {
    options.name = options.event;
  }
  return options as unknown as EventHandler;
}
