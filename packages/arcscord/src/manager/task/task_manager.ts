import type { Task } from "#/base";
import { BaseManager, TaskContext } from "#/base";
import { anyToError } from "@arcscord/error";
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
   * Loads multiple tasks into the TaskManager.
   *
   * @param tasks - An array of tasks to load.
   */
  loadTasks(tasks: Task[]): void {
    tasks.forEach(task => this.loadTask(task));
  }

  /**
   * Loads a single task into the TaskManager.
   *
   * @param task - The task to load.
   */
  loadTask(task: Task): void {
    if (this.crons.has(task.name)) {
      return this.logger.fatal(`a task with name ${task.name} already exist !`);
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

      const nextRuns = crons.map(cron => cron.nextDate().toISO()).join(", ");
      this.logger.info(
        `loaded multi cron task ${task.name}, next runs : ${nextRuns}`,
      );
      return;
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

      const nextRun = cron.nextDate().toISO();
      this.logger.trace(
        `loaded cron task ${task.name} (${task.interval}), next execute : ${nextRun}`,
      );
      return;
    }

    const interval = setInterval(() => {
      void this.runTask(task);
    }, task.interval);

    this.crons.set(task.name, interval);
    this.logger.info(
      `Loaded interval task ${task.name}, next runs ${new Date(Date.now() + task.interval).toISOString()}`,
    );
  }

  private async runTask(task: Task): Promise<void> {
    try {
      const cron = this.crons.get(task.name);
      if (!cron) {
        this.logger.warning("task run but not registered !");
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
      const [result, err] = await task.run(context);
      if (err) {
        err.generateId();
        return this.logger.error(err.message);
      }

      this.logger.trace(`executed task ${task.name} with result : ${result}`);
    }
    catch (e) {
      this.logger.error(
        `Error running task ${task.name}: ${anyToError(e).message}`,
      );
    }
  }
}
