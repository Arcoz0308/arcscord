import type { ArcClient, TaskResult } from "#/base";
import type { Task } from "#/base/task/task.type";
import type { TaskErrorOptions } from "#/utils";
import { TaskError } from "#/utils";
import { error, ok } from "@arcscord/error";

type TaskContextOptions = {
  nextRun: Date;
}

export class TaskContext {

  client: ArcClient;

  task: Task;

  nextRun: Date;

  constructor(client: ArcClient, task: Task, options: TaskContextOptions) {

    this.client = client;
    this.task = task;
    this.nextRun = options.nextRun;
  }

  ok(value: string | true): TaskResult {
    return ok(value);
  }

  error(options: Omit<TaskErrorOptions, "task">): TaskResult {
    return error(new TaskError({ ...options, task: this.task }));
  }

  async multiple(...funcList: Promise<TaskResult>[]): Promise<TaskResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }

}