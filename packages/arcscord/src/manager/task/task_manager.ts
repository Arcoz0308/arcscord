import { CronJob } from "cron";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import { anyToError } from "@arcscord/error";
import type { Task } from "#/base";
import { TaskContext } from "#/base";

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

    if (Array.isArray(task.interval)) {
      const crons: CronJob[] = [];
      for (const interval of task.interval) {
        crons.push(new CronJob(interval, () => {
          void this.runTask(task);
        }, null, true));
      }
      this.crons.set(task.name, crons);

      const nextRuns = crons.map((cron) => cron.nextDate().toISO()).join(", ");
      this.logger.info(`loaded multi cron task ${task.name}, next runs : ${nextRuns}`);
      return;
    }

    if (typeof task.interval === "string") {
      const cron = new CronJob(task.interval, () => {
        void this.runTask(task);
      }, null, true);
      this.crons.set(task.name, cron);

      const nextRun = cron.nextDate().toISO();
      this.logger.trace(`loaded cron task ${task.name} (${task.interval}), next execute : ${nextRun}`);
      return;
    }

    const interval = setInterval(() => {
      void this.runTask(task);
    }, task.interval);

    this.crons.set(task.name, interval);
    this.logger.info(`Loaded interval task ${task.name}, next runs ${new Date(Date.now() + task.interval).toISOString()}`);
  }

  async runTask(task: Task): Promise<void> {
    try {
      const cron = this.crons.get(task.name);
      if (!cron) {
        this.logger.warning("task run but not registered !");
      }

      const next = Array.isArray(cron)
        ? cron.sort((a, b) => a.nextDate().toMillis() - b.nextDate().toMillis())[0].nextDate().toJSDate()
        : cron instanceof CronJob ? cron.nextDate().toJSDate() : typeof task.interval === "number" ? new Date(Date.now() + task.interval) : new Date();
      const context = new TaskContext(this.client, task, {
        nextRun: next,
      });
      const [result, err] = await task.run(context);
      if (err) {
        err.generateId();
        return this.logger.error(err.message);
      }

      this.logger.trace(`executed task ${task.name} with result : ${result}`);
    } catch (e) {
      this.logger.error(`Error running task ${task.name}: ${anyToError(e).message}`);
    }
  }

}