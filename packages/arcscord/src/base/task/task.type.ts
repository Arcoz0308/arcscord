import type { TaskContext } from "#/base/task/task_context";
import type { MaybePromise } from "#/utils";
import type { TaskError } from "#/utils/error/class/task_error";
import type { Result } from "@arcscord/error";

/**
 * Represents a result of a task, which can be either a success or an error.
 */
export type TaskResult = Result<string | true, TaskError>;

/**
 * Represents a task with a specified interval, name, and a run function.
 */
export type Task = {
  /**
   * The interval at which the task should be run.
   * It can be a cron expression string, an array of cron expression strings, or a number representing milliseconds.
   */
  interval: string | string[] | number;

  /**
   * The name of the task.
   */
  name: string;

  /**
   * The function to be executed when the task runs.
   * It receives a TaskContext as an argument and returns a TaskResult.
   */
  run: (ctx: TaskContext) => MaybePromise<TaskResult>;
};
