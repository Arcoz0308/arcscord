import type { ClientEvents } from "discord.js";
import type { EventHandler } from "#/base/event/event.type";

export const createEvent = <E extends keyof ClientEvents>(options: EventHandler<E>): EventHandler => {
  return options as unknown as EventHandler;
};