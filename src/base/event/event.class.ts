import type { DevFacultative } from "#/manager/dev";
import type { ArcClient } from "#/base/client/client.class";
import type { ClientEvents } from "discord.js";
import type { EventHandleResult } from "#/base/event/event.type";

export abstract class Event<E extends keyof ClientEvents> implements DevFacultative {

  isEnableInDev = false;

  client: ArcClient;

  abstract event: E;

  abstract name: string;

  waitReady: boolean = false;

  constructor(client: ArcClient) {
    this.client = client;
  }


  abstract handle(...args: ClientEvents[E]): EventHandleResult|Promise<EventHandleResult>;

}