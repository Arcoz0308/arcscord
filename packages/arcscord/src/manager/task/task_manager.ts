import type { Task } from "#/base/task/task.class";
import { CronJob } from "cron";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import { anyToError } from "@arcscord/error";

export class TaskManager extends BaseManager {


  name = "task";

  devConfigKey: DevConfigKey = "tasks";

  crons: Map<string, CronJob|CronJob[]|NodeJS.Timeout> = new Map();


  loadTasks(tasks: Task[]) {
    tasks.forEach((task) => this.loadTask(task));
  }

  loadTask(task: Task): void {
    if (this.crons.has(task.name)) {
      return this.logger.fatal(`a task with name ${task.name} already exist !`);
    }

    switch (task.type) {
      case "cron":
        this.loadCronTask(task);
        break;
      case "multiCron":
        this.loadMultiCronTask(task);
        break;
      case "delay":
        this.loadDelayTask(task);
        break;
      default:
        this.logger.fatal(`invalid type get for task ${task.name}`, {
          type: task.type,
        });
    }
  }

  async runTask(task: Task): Promise<void> {
    try {
      const [result, err] = await task.run();
      if (err) {
        err.generateId();
        return this.logger.error(err.message);
      }

      this.logger.trace(`executed task ${task.name} with result : ${result}`);
    } catch (e) {
      this.logger.error(`Error running task ${task.name}: ${anyToError(e).message}`);
    }
  }

  // loading tasks
  loadCronTask(task: Task): void {
    if (typeof task.interval !== "string") {
      return this.logger.fatal(`dont get string as type for interval value in task ${task.name}`, {
        isArray: Array.isArray(task.interval),
        valueType: typeof task.interval,
        TaskType: task.type,
      });
    }

    const cron = new CronJob(task.interval, () => {
      void this.runTask(task);
    });

    const nextRun = cron.nextDate().setLocale("fr-CH").toLocaleString({ timeZone: "Europe/Zurich" });
    this.logger.trace(`loaded cron task ${task.name} (${task.interval}), next execute : ${nextRun}`);
    this.crons.set(task.name, cron);
  }

  loadMultiCronTask(task: Task): void {
    if (!Array.isArray(task.interval)) {
      return this.logger.fatal(`dont get a array for interval value in task ${task.name}`, {
        valueType: typeof task.interval,
        TaskType: task.type,
      });
    }

    if (task.interval.length < 1) {
      return this.logger.fatal(`get 0 value in array for multi cron task ${task.name}`);
    }

    const crons: CronJob[] = [];
    for (const interval of task.interval) {
      crons.push(new CronJob(interval, () => {
        void this.runTask(task);
      }));
    }

    const nextRuns = crons.map((cron) => cron.nextDate().setLocale("fr-CH").toLocaleString({ timeZone: "Europe/Zurich" }))
      .join(", ");
    this.logger.trace(`loaded multi cron task ${task.name}, next runs : ${nextRuns}`);
    this.crons.set(task.name, crons);
  }

  loadDelayTask(task: Task): void {
    if (typeof task.interval !== "number") {
      return this.logger.fatal(`dont get number as type for interval value in task ${task.name}`, {
        isArray: Array.isArray(task.interval),
        valueType: typeof task.interval,
        TaskType: task.type,
      });
    }

    const interval = setInterval(() => {
      void this.runTask(task);
    }, task.interval);
    this.crons.set(task.name, interval);
  }

}