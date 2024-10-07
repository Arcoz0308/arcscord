import type { Task } from "#/base/task/task.type";
import type { ErrorOptions } from "@arcscord/better-error";
import { BaseError } from "@arcscord/better-error";

export type TaskErrorOptions = ErrorOptions & {
  task: Task;
};

export class TaskError extends BaseError {
  task: Task;

  constructor(options: TaskErrorOptions) {
    super(options);

    this.name = "TaskError";

    this.task = options.task;

    this._debugs.set("taskName", options.task.name);
    this._debugs.set(
      "taskInterval",
      typeof this.task.interval === "string"
        ? this.task.interval
        : typeof this.task.interval === "number"
          ? `${this.task.interval}`
          : `"${this.task.interval.join("\", \"")}`,
    );
  }
}
