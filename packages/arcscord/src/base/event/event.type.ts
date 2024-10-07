import type { EventContext } from "#/base/event/event_context";
import type { EventError } from "#/utils/error/class/event_error";
import type { Result } from "@arcscord/error";
import type { ClientEvents } from "discord.js";

export type EventHandleResult = Result<string | true, EventError>;

export type EventHandler<E extends keyof ClientEvents = keyof ClientEvents> = {
  event: E;
  name: string;
  waitReady?: boolean;
  run: (
    ctx: EventContext,
    ...args: ClientEvents[E]
  ) => EventHandleResult | Promise<EventHandleResult>;
};
