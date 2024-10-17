import type { CommandContext, CommandMiddlewareRun } from "arcscord";
import { CommandMiddleware, createCommand } from "arcscord";

export class TestMiddleware extends CommandMiddleware {
  name = "test" as const;

  async run(ctx: CommandContext): Promise<
    CommandMiddlewareRun<{
      dev: boolean;
    }>
  > {
    if (ctx.inDM) {
      return this.cancel(ctx.reply("No work in mp"));
    }

    const flags = await ctx.user.fetchFlags();

    return this.next({
      dev: flags.has("ActiveDeveloper"),
    });
  }
}

export const testMiddlewareCommand = createCommand({
  build: {
    slash: {
      name: "test-middleware",
      description: "test",
    },
  },
  use: [new TestMiddleware()],
  run: (ctx) => {
    return ctx.reply(
      `You have a active dev badge ? ${ctx.additional.test.dev}`,
    );
  },
});
