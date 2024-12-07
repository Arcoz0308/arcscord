import type { ArcClient, TaskResult } from "#/base";
import type { TaskHandler } from "#/base/task/task.type";
import type { TaskErrorOptions } from "#/utils";
import { TaskError } from "#/utils";
import { error, ok } from "@arcscord/error";

type TaskContextOptions = {
  nextRun: Date;
};

/**
 * Represents the context in which a task runs.
 */
export class TaskContext {
  /**
   * The ArcClient instance.
   */
  client: ArcClient;

  /**
   * The task to be run.
   */
  task: TaskHandler;

  /**
   * The next scheduled run date of the task.
   */
  nextRun: Date;

  /**
   * Constructs a new TaskContext instance.
   * @param client - The ArcClient instance.
   * @param task - The task to be run.
   * @param options - Additional context options, including the next run date.
   */
  constructor(client: ArcClient, task: TaskHandler, options: TaskContextOptions) {
    this.client = client;
    this.task = task;
    this.nextRun = options.nextRun;
  }

  /**
   * Returns a successful TaskResult.
   * @param value - The value to be returned with a success status. Defaults to true.
   * @returns A successful TaskResult.
   */
  ok(value: string | true = true): TaskResult {
    return ok(value);
  }

  /**
   * Returns an error TaskResult.
   * @param options - Options for the TaskError, omitting the task.
   * @returns An error TaskResult.
   */
  error(options: Omit<TaskErrorOptions, "task">): TaskResult {
    return error(new TaskError({ ...options, task: this.task }));
  }

  /**
   * Runs multiple TaskResult promises sequentially.
   * @param funcList - List of TaskResult promises to run.
   * @returns A final TaskResult indicating the status of all tasks.
   */
  async multiple(...funcList: Promise<TaskResult>[]): Promise<TaskResult> {
    for (const func of funcList) {
      const [err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }
}
