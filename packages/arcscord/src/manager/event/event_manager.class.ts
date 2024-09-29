import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import { anyToError } from "@arcscord/error";
import type { EventHandler } from "#/base/event/event.type";
import { EventContext } from "#/base/event/event_context";

export class EventManager extends BaseManager {

  name = "event";

  devConfigKey: DevConfigKey = "events";

  loadEvents(events: EventHandler[]) {
    events.forEach(event => void this.loadEvent(event));
  }

  async loadEvent(event: EventHandler): Promise<void> {
    this.logger.trace(`bind event ${event.event} for ${event.name} handler !`);
    if (event.waitReady) {
      await this.client.waitReady();
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.client.on(event.event, async(...args) => {
      try {
        const context = new EventContext(this.client, event);
        const [result, error] = await event.run(context, ...args);
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