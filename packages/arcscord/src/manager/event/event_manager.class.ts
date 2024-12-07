import type { ArcClient } from "#/base/client/client.class";
import type { EventHandler } from "#/base/event/event.type";
import type { EventManagerOptions, EventResultHandlerInfos } from "./event_manager.type";
import { EventContext } from "#/base/event/event_context";
import { BaseManager } from "#/base/manager/manager.class";
import { intentsMap } from "#/manager/event/intents_map";
import { EventError } from "#/utils";
import { anyToError, error } from "@arcscord/error";

/**
 * Manages event handling for the Discord client.
 */
export class EventManager extends BaseManager {
  name = "event";

  options: Required<EventManagerOptions>;

  constructor(client: ArcClient, options?: EventManagerOptions) {
    super(client);

    this.options = {
      autoIntents: false,
      resultHandler: this.handleResult,
      ...options,
    };
  }

  /**
   * Loads a list of event handlers.
   *
   * @param events - An array of event handlers to load.
   */
  loadEvents(events: EventHandler[]): void {
    events.forEach(event => void this.loadEvent(event));
  }

  /**
   * Loads a single event handler.
   *
   * @param event - The event handler to load.
   */
  async loadEvent(event: EventHandler): Promise<void> {
    this.trace(`bind event ${event.event} for ${event.name} handler !`);
    if (this.options.autoIntents) {
      if (event.options?.disableAutoIntents !== true) {
        if (event.options?.intentsOverwrite) {
          this.client.addIntents(event.options.intentsOverwrite);
        }
        else {
          const eventName = event.event;
          this.client.addIntents(intentsMap[eventName]);
        }
      }
    }
    if (event.options?.waitReady) {
      await this.client.waitReady();
    }

    this.client.on(event.event, async (...args) => {
      try {
        const context = new EventContext(this.client, event);
        const result = await event.run(context, ...args);
        this.trace(`run event ${event.name}, result : ${result[0] || "error"}`);
        this.options.resultHandler({
          result,
          event,
          eventName: event.event,
        });
      }
      catch (e) {
        this.options.resultHandler({
          result: error(new EventError({
            message: `failed to run event handler : ${anyToError(e).message}`,
            handler: event,
            originalError: anyToError(e),
          })),
          event,
          eventName: event.event,
        });
      }
    });
  }

  async handleResult(infos: EventResultHandlerInfos): Promise<void> {
    const [err, result] = infos.result;
    if (err !== null) {
      err.generateId();
      this.logger.logError(err);
      return;
    }

    this.logger.info(
      `${infos.eventName} event used by ${infos.event.name}. Result : ${
        typeof result === "string" ? result : "success"
      }`,
    );
  }
}
