import type { EventContext } from "#/base/event/event_context";
import type { MaybePromise } from "#/utils";
import type { EventError } from "#/utils/error/class/event_error";
import type { Result } from "@arcscord/error";
import type { BitFieldResolvable, ClientEvents, GatewayIntentsString } from "discord.js";

/**
 * Represents the result of an event handler.
 */
export type EventHandleResult = Result<string | true, EventError>;

/**
 * Options for configuring event handlers.
 */
export type EventHandlerOptions = {
  /**
   * Indicates whether to wait until the client is ready before load the handler
   */
  waitReady?: boolean;

  /**
   * disable autoIntents if autoIntents enable.
   * @default false
   * @see {ArcClientOptions.autoIntents}
   */
  disableAutoIntents?: boolean;

  /**
   * Overwrite the intents of the event, will disable autoIntent.
   */
  intentsOverwrite?: BitFieldResolvable<GatewayIntentsString, number>;
};

/**
 * Represents an event handler for the Discord client.
 */
export type EventHandler<E extends keyof ClientEvents = keyof ClientEvents> = {
  /**
   * The name of the event.
   */
  event: E;

  /**
   * The name of the event handler.
   */
  name: string;

  /**
   * Optional configuration object for the event handler.
   */
  options?: EventHandlerOptions;

  /**
   * The function to run when the event is triggered.
   *
   * @param ctx - The event context.
   * @param args - The arguments for the event.
   * @returns A result indicating success or error.
   */
  run: (
    ctx: EventContext,
    ...args: ClientEvents[E]
  ) => MaybePromise<EventHandleResult>;
};
