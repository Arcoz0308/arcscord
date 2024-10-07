import type { EventHandler } from "#/base/event/event.type";
import { EventContext } from "#/base/event/event_context";
import { BaseManager } from "#/base/manager/manager.class";
import { anyToError } from "@arcscord/error";

export class EventManager extends BaseManager {
  name = "event";

  loadEvents(events: EventHandler[]): void {
    events.forEach(event => void this.loadEvent(event));
  }

  async loadEvent(event: EventHandler): Promise<void> {
    this.logger.trace(`bind event ${event.event} for ${event.name} handler !`);
    if (event.waitReady) {
      await this.client.waitReady();
    }

    this.client.on(event.event, async (...args) => {
      try {
        const context = new EventContext(this.client, event);
        const [result, error] = await event.run(context, ...args);
        if (error) {
          this.logger.error(error.message);
          return;
        }
        this.logger.trace(`run event ${event.name}, result : ${result}`);
      }
      catch (e) {
        this.logger.error(
          `failed to run event handler : ${anyToError(e).message}`,
        );
      }
    });
  }
}
