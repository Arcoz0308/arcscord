import type { DevFacultative } from "#/manager/dev";
import type { Client } from "#/base/client/client.class";
import type { TaskType } from "#/base/task/task.type";

export abstract class Task implements DevFacultative {

  isEnableInDev = false;

  abstract name: string;

  client: Client;

  abstract type: TaskType;

  abstract interval: number|string|string[]

  constructor(client: Client) {
    this.client = client;
  }

}