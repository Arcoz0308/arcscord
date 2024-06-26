import type { ErrorOptions } from "#/utils/error/class/base_error";
import { BaseError } from "#/utils/error/class/base_error";
import type { Task } from "#/base/task/task.class";
import type { DebugValueString } from "#/utils/error/error.type";

export type TaskErrorOptions = ErrorOptions & {
  task: Task;
}

export class TaskError extends BaseError {

  task: Task;

  constructor(options: TaskErrorOptions) {
    super(options);

    this.name = "TaskError";

    this.task = options.task;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];

    const interval = typeof this.task.interval === "string" ? this.task.interval
      : (typeof this.task.interval === "number") ? `${this.task.interval}`
        : ("\"" + this.task.interval.join("\", \""));

    debugs.push(["taskName", this.task.name], ["taskType", this.task.type], ["interval", interval]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}