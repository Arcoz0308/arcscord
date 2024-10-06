import { createEvent } from "#/base/event/event.func";

export const messageEvent = createEvent({
  event: "messageCreate",
  run: (ctx, msg) => {
    ctx.client.logger.info(`message send by ${msg.author.username}!`);
    return ctx.ok(true);
  },
});