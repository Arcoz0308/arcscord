import type { ArcClient, EventHandleResult } from "#/base";
import type { EventHandler } from "#/base/event/event.type";
import type { ContextDocs } from "#/base/utils";
import type { EventErrorOptions } from "#/utils";
import { EventError } from "#/utils";
import { error, ok } from "@arcscord/error";

/**
 * The context in which an event handler is executed.
 */
export class EventContext implements Pick<ContextDocs, "client"> {
  client: ArcClient;

  /**
   * The event handler.
   */
  handler: EventHandler;

  /**
   * Creates an instance of EventContext.
   *
   * @param client - The client instance.
   * @param handler - The event handler.
   */
  constructor(client: ArcClient, handler: EventHandler) {
    this.client = client;
    this.handler = handler;
  }

  /**
   * Returns a successful result.
   *
   * @param value - The value to wrap in the result. Defaults to `true`.
   * @returns A successful event handle result.
   */
  ok(value: string | true = true): EventHandleResult {
    return ok(value);
  }

  /**
   * Returns an error result.
   *
   * @param options - The options for the event error.
   * @returns An error event handle result.
   */
  error(options: Omit<EventErrorOptions, "handler">): EventHandleResult {
    return error(new EventError({ ...options, handler: this.handler }));
  }

  /**
   * Executes multiple promises and returns the first error result encountered.
   *
   * @param funcList - The list of promises to execute.
   * @returns A successful result if all promises succeed, otherwise the first error result.
   */
  async multiple(
    ...funcList: Promise<EventHandleResult>[]
  ): Promise<EventHandleResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }
}
