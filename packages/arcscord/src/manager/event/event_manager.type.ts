import type { EventHandler } from "#/base/event";
import type { EventError } from "#/utils";
import type { BaseError } from "@arcscord/better-error";
import type { Result } from "@arcscord/error";
import type { ClientEvents } from "discord.js";

export type EventResultHandlerInfos = {
  /**
   * The result of the event execution.
   */
  result: Result<string | true, BaseError | EventError>;

  /**
   * The event handler object
   */
  event: EventHandler;

  /**
   * the event name
   */
  eventName: keyof ClientEvents | string;
};

export type EventResultHandler = (
  infos: EventResultHandlerInfos
) => void | Promise<void>;

export type EventManagerOptions = {
  /**
   * Indicates whether the intents for event should be detected by default.
   * @default false
   * @experimental
   */
  autoIntents?: boolean;

  /**
   * Set a custom result handler
   * @default {@link EventManager.resultHandler}
   */
  resultHandler?: EventResultHandler;
};
