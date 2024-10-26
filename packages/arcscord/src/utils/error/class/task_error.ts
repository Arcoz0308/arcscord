import type { TaskHandler } from "#/base/task/task.type";
import type { ErrorOptions } from "@arcscord/better-error";
import { BaseError } from "@arcscord/better-error";

/**
 * Options for creating a TaskError.
 */
export type TaskErrorOptions = ErrorOptions & {
  /**
   * The task associated with the error.
   */
  task: TaskHandler;
};

/**
 * A custom error class for handling task-related errors.
 */
export class TaskError extends BaseError {
  /**
   * The task associated with the error.
   */
  task: TaskHandler;

  /**
   * Creates a new instance of TaskError.
   * @param options - The options for creating the TaskError.
   */
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
