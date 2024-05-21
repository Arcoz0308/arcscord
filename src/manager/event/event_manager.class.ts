import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";
import { anyToError } from "#/utils/error/error.util";
import { eventHandlers } from "#/manager/event/event_manager.util";
import { isDev } from "#/utils/config/env";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";

export class EventManager extends BaseManager {

  name = "event";

  devConfigKey: DevConfigKey = "events";

  load(): void {
    let events = eventHandlers(this.client);
    if (isDev) {
      events = this.checkInDev(events);
    }
    let i = 0;
    for (const event of events) {
      void this.loadEvent(event);
      i++;
    }

    this.logger.info(`loaded ${i} event handlers !`);
  }

  async loadEvent(event: Event<keyof ClientEvents>): Promise<void> {
    this.logger.trace(`bind event ${event.event} for ${event.name} handler !`);
    if (event.waitReady) {
      await this.client.waitReady();
    }
    this.client.on(event.event, async(...args) => {
      try {
        const [result, error] = await event.handle(...args);
        if (error) {
          this.logger.logError(error);
          return;
        }
        this.logger.trace(`run event ${event.name}, result : ${result}`);

      } catch (e) {
        this.logger.error(`failed to run event handler : ${anyToError(e).message}`);
      }
    });
  }


}