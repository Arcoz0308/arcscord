import type { Client } from "#/base/client/client.class";
import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";
import { Logger } from "#/utils/logger/logger.class";
import { anyToError } from "#/utils/error/error.util";
import { eventHandlers } from "#/manager/event/event_manager.util";
import { isDev } from "#/utils/config/env";

export class EventManager {

  client: Client;

  logger: Logger = new Logger("event");

  constructor(client: Client) {
    this.client = client;
  }

  load(): void {
    let events = eventHandlers(this.client);
    if (isDev) {
      events = this.checkEventInDev(events);
    }
    let i = 0;
    for (const event of events) {
      this.loadEvent(event);
      i++;
    }

    this.logger.info(`loaded ${i} event handlers !`);
  }

  loadEvent(event: Event<keyof ClientEvents>): void {
    this.logger.trace(`bind event ${event.event} for ${event.name} handler !`);
    this.client.on(event.event, async(...args) => {
      try {
        const [result, error] = await event.handle(...args);
        if (error) {
          this.logger.error(error.message, error.getDebugsString());
          return;
        }
        this.logger.trace(`run event ${event.name}, result : ${result}`);

      } catch (e) {
        this.logger.error(`failed to run event handler : ${anyToError(e).message}`);
      }
    });
  }

  isEventEnableInDev(event: Event<keyof ClientEvents>): boolean {
    if (event.isEnableInDev) {
      return true;
    }
    return this.client.devManager.isDevEnable(event.name, "events");
  }

  checkEventInDev(events: Event<keyof ClientEvents>[]): Event<keyof ClientEvents>[] {
    this.logger.trace(`Filter events for dev mode (full list : ${events.map((evt) => evt.name).join(", ")})`);
    const events2 = events.filter(event => this.isEventEnableInDev(event));
    this.logger.trace(`Events for dev mode filtered ! (enabled events : ${events2.map((evt) => evt.name).join(", ")})`);
    return events2;
  }

}