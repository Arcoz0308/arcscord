import { createTask } from "arcscord";

export const cronTask = createTask({
  interval: "*/10 * * * *",
  name: "cron",
  run: (ctx) => {
    ctx.client.logger.trace(
      `Running cron task, next run ${ctx.nextRun.toISOString()}`,
    );
    return ctx.ok(true);
  },
});
