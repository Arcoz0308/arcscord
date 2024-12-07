import type { ArcClient, TaskHandler } from "#/base";
import type { Result } from "@arcscord/error";
import type { TaskErrorHandlerInfos, TaskManagerOptions } from "./task_manager.type";
import { BaseManager, TaskContext } from "#/base";
import { BaseError } from "@arcscord/better-error";
import { anyToError, error, ok } from "@arcscord/error";
import { CronJob } from "cron";

/**
 * Represents a manager for handling tasks.
 */
export class TaskManager extends BaseManager {
  name = "task";

  /**
   * A map to store tasks and their corresponding cron jobs or intervals.
   */
  crons: Map<string, CronJob | CronJob[] | NodeJS.Timeout> = new Map();

  /**
   * task manager options
   */
  options: Required<TaskManagerOptions>;

  constructor(client: ArcClient, options?: TaskManagerOptions) {
    super(client);

    this.options = {
      errorHandler: this.errorHandler,
      ...options,
    };
  }

  /**
   * Loads multiple tasks into the TaskManager.
   *
   * @param tasks - An array of tasks to load.
   */
  loadTasks(tasks: TaskHandler[]): Result<number, BaseError> {
    for (const task of tasks) {
      const [err] = this.loadTask(task);
      if (err) {
        return error(err);
      }
    }
    return ok(tasks.length);
  }

  /**
   * Loads a single task into the TaskManager.
   *
   * @param task - The task to load.
   * @returns the date of next run in milliseconds
   */
  loadTask(task: TaskHandler): Result<number, BaseError> {
    if (this.crons.has(task.name)) {
      return error(new BaseError(`a task with name ${task.name} already exist !`));
    }

    if (Array.isArray(task.interval)) {
      const crons: CronJob[] = [];
      for (const interval of task.interval) {
        crons.push(
          new CronJob(
            interval,
            () => {
              void this.runTask(task);
            },
            null,
            true,
          ),
        );
      }
      this.crons.set(task.name, crons);

      const nextRuns = crons.map(cron => cron.nextDate().toMillis());
      this.trace(`loaded multi cron task ${task.name}, next runs : ${nextRuns}`);
      return ok(Math.min(...nextRuns));
    }

    if (typeof task.interval === "string") {
      const cron = new CronJob(
        task.interval,
        () => {
          void this.runTask(task);
        },
        null,
        true,
      );
      this.crons.set(task.name, cron);

      const nextRun = cron.nextDate().toMillis();
      this.trace(
        `loaded cron task ${task.name} (${task.interval}), next execute : ${nextRun}`,
      );
      return ok(nextRun);
    }

    const interval = setInterval(() => {
      void this.runTask(task);
    }, task.interval);

    this.crons.set(task.name, interval);
    this.trace(
      `Loaded interval task ${task.name}, next runs ${new Date(Date.now() + task.interval).toISOString()}`,
    );
    return ok(Date.now() + task.interval);
  }

  private async runTask(task: TaskHandler): Promise<void> {
    try {
      const cron = this.crons.get(task.name);
      if (!cron) {
        this.trace("task run but not registered !");
      }

      const next = Array.isArray(cron)
        ? cron
          .sort(
            (a, b) => a.nextDate().toMillis() - b.nextDate().toMillis(),
          )[0]
          .nextDate()
          .toJSDate()
        : cron instanceof CronJob
          ? cron.nextDate().toJSDate()
          : typeof task.interval === "number"
            ? new Date(Date.now() + task.interval)
            : new Date();
      const context = new TaskContext(this.client, task, {
        nextRun: next,
      });
      const [err, result] = await task.run(context);
      if (err) {
        this.options.errorHandler({
          error: err,
          task,
          taskName: task.name,
        });
      }

      this.trace(`executed task ${task.name} with result : ${result}`);
    }
    catch (e) {
      this.options.errorHandler({
        error: new BaseError({
          message: `Error running task ${task.name}: ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
        task,
        taskName: task.name,
      });
    }
  }

  errorHandler(infos: TaskErrorHandlerInfos): void {
    this.logger.logError(infos.error.generateId());
  }
}
