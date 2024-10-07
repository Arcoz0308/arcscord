import type { TaskContext } from "#/base/task/task_context";
import type { TaskError } from "#/utils/error/class/task_error";
import type { Result } from "@arcscord/error";

export type TaskResult = Result<string | true, TaskError>;

export type Task = {
  interval: string | string[] | number;
  name: string;

  run: (ctx: TaskContext) => TaskResult | Promise<TaskResult>;
};
