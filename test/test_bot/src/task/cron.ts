import { createTask } from "arcscord";

export const cronTask = createTask({
  interval: "*/10 * * * *",
  name: "cron",
  run: (ctx) => {
    console.log(`Running cron task, next run ${ctx.nextRun.toISOString()}`);
    return ctx.ok(true);
  },
});
