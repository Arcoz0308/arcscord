import type { ComponentContext, ComponentMiddlewareRun } from "arcscord";
import { buildClickableButton, ComponentMiddleware, createButton } from "arcscord";

class Middleware extends ComponentMiddleware {
  readonly name = "authorOnly" as const;

  async run(ctx: ComponentContext): Promise<ComponentMiddlewareRun<NonNullable<unknown>>> {
    if (!ctx.isMessageComponentContext() || !ctx.message.interactionMetadata) {
      return this.next({});
    }

    if (ctx.message.interactionMetadata.user.id !== ctx.user.id) {
      return this.cancel<NonNullable<unknown>>(await ctx.reply("Author only", {
        ephemeral: true,
      }));
    }

    return this.next({});
  }
}

export const middleWareButton = createButton({
  build: () => buildClickableButton({
    label: "Click",
    style: "green",
    customId: "middleware",
  }),
  matcher: "middleware",
  use: [new Middleware()],
  run: (ctx) => {
    return ctx.reply("Clicked", {
      ephemeral: true,
    });
  },
});
