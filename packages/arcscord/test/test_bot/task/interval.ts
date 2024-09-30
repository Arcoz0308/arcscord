import { createTask } from "#/base";

export const intervalTask = createTask({
  interval: 1000 * 60 * 3,
  name: "interval",
  run: (ctx) => {
    ctx.client.logger.info(`Run interval, next one : ${ctx.nextRun.toISOString()}`);
    return ctx.ok(true);
  },
});