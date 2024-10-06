import type { ArcClient, EventHandleResult } from "#/base";
import { error, ok } from "@arcscord/error";
import type { EventErrorOptions } from "#/utils";
import { EventError } from "#/utils";
import type { EventHandler } from "#/base/event/event.type";

export class EventContext {

  client: ArcClient;

  handler: EventHandler;

  constructor(client: ArcClient, handler: EventHandler) {
    this.client = client;
    this.handler = handler;
  }

  ok(value: string | true = true): EventHandleResult {
    return ok(value);
  }

  error(options: Omit<EventErrorOptions, "handler">): EventHandleResult {
    return error(new EventError({ ...options, handler: this.handler }));
  }

  async multiple(...funcList: Promise<EventHandleResult>[]): Promise<EventHandleResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }


}