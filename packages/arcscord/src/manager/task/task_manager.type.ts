import type { TaskHandler } from "#/base";
import type { TaskError } from "#/utils";
import type { BaseError } from "@arcscord/better-error";

export type TaskErrorHandlerInfos = {
  /**
   * The error that occurred.
   */
  error: BaseError | TaskError;

  /**
   * The task handler object
   */
  task: TaskHandler;

  /**
   * The task name
   */
  taskName: string;
};

export type TaskErrorHandler = (
  infos: TaskErrorHandlerInfos
) => void | Promise<void>;

/**
 * Defines task manager options
 */
export type TaskManagerOptions = {
  /**
   * Set a custom result handler
   * @default {@link TaskManager.resultHandler}
   */
  errorHandler?: TaskErrorHandler;
};
