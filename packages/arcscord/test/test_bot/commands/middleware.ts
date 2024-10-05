import type { CommandMiddlewareRun } from "#/base/command/command_middleware";
import { CommandMiddleware } from "#/base/command/command_middleware";
import type { CommandContext } from "#/base";
import { createCommand } from "#/base/command/command_func";

class TestMiddleware extends CommandMiddleware {

  name = "test" as const;

  async run(ctx: CommandContext): Promise<CommandMiddlewareRun<{
    dev: boolean;
  }>> {
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
    return ctx.reply(`You have a active dev badge ? ${ctx.additional.test.dev}`);
  },
});