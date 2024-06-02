import type { DevFacultative } from "#/manager/dev";
import type { ArcClient } from "#/base/client/client.class";
import type { TaskResult, TaskType } from "#/base/task/task.type";

export abstract class Task implements DevFacultative {

  isEnableInDev = false;

  abstract name: string;

  client: ArcClient;

  abstract type: TaskType;

  abstract interval: number|string|string[]

  needReady: boolean = false;

  constructor(client: ArcClient) {
    this.client = client;
  }

  abstract run(): TaskResult | Promise<TaskResult>

}