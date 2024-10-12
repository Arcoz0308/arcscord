import type { EventHandler } from "#/base/event/event.type";
import type { OptionalProperties } from "#/utils";
import type { ClientEvents } from "discord.js";

/**
 * Creates an event handler with the given options.
 *
 * @param  options - The options for the event handler.
 * @return The created event handler.
 *
 * @example ```ts
 * const eventHandler = createEvent({
 *   event: "messageCreate",
 *   run: (ctx, message) => {
 *     console.log(`Message received: ${message.content}`);
 *     return ctx.ok();
 *   }
 * });
 * ```
 */
export function createEvent<E extends keyof ClientEvents>(
  options: OptionalProperties<EventHandler<E>, "name">,
): EventHandler {
  if (!options.name) {
    options.name = options.event;
  }
  return options as unknown as EventHandler;
}
