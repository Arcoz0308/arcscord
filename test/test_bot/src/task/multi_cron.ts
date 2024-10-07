import { createTask } from "arcscord";

export const multiCronTask = createTask({
  interval: ["*/8 * * * *", "*/3 * * * *"],
  name: "multi_cron",
  run: (ctx) => {
    ctx.client.logger.trace(
      `Running multi cron task, next run ${ctx.nextRun.toISOString()}`,
    );
    return ctx.ok(true);
  },
});
