import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import { anyToError } from "@arcscord/error";

export class EventManager extends BaseManager {

  name = "event";

  devConfigKey: DevConfigKey = "events";

  loadEvents(events: Event<keyof ClientEvents>[]) {
    events.forEach(event => void this.loadEvent(event));
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
          this.logger.error(error.message);
          return;
        }
        this.logger.trace(`run event ${event.name}, result : ${result}`);

      } catch (e) {
        this.logger.error(`failed to run event handler : ${anyToError(e).message}`);
      }
    });
  }


}