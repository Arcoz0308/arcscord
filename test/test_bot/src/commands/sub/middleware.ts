import { createCommand } from "arcscord";
import { TestMiddleware } from "../middleware";

export const testMiddlewareSubCommand = createCommand({
  build: {
    name: "test-middleware",
    description: "test",

  },
  use: [new TestMiddleware()],
  run: (ctx) => {
    return ctx.reply(
      `You have a active dev badge ? ${ctx.additional.test.dev}`,
    );
  },
});
