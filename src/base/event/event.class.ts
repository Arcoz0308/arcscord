import type { DevFacultative } from "#/manager/dev";
import type { Client } from "#/base/client/client.class";
import type { ClientEvents } from "discord.js";
import type { EventHandleResult } from "#/base/event/event.type";

export abstract class Event<E extends keyof ClientEvents> implements DevFacultative {

  isEnableInDev = false;

  client: Client;

  abstract event: E;

  abstract name: string;

  constructor(client: Client) {
    this.client = client;
  }


  abstract handle(...args: ClientEvents[E]): EventHandleResult|Promise<EventHandleResult>;

}