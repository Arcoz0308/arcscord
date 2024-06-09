import type { taskTypes } from "./task.enum";
import type { Result } from "#/utils/error/error.type";
import type { TaskError } from "#/utils/error/class/task_error";

export type TaskType = keyof typeof taskTypes;

export type TaskResult = Result<string|true, TaskError>;