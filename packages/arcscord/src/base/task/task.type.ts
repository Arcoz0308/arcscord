import type { taskTypes } from "./task.enum";
import type { TaskError } from "#/utils/error/class/task_error";
import type { Result } from "@arcscord/error";

export type TaskType = keyof typeof taskTypes;

export type TaskResult = Result<string|true, TaskError>;