import type { ComponentContext, ComponentMiddlewareRun } from "arcscord";
import type { MessageOptions } from "../type";
import { ComponentMiddleware } from "arcscord";

export class AuthorOnlyMiddleware extends ComponentMiddleware {
  name = "authorOnly" as const;

  message: MessageOptions;

  constructor(message: MessageOptions) {
    super();

    this.message = message;
  }

  run(ctx: ComponentContext): ComponentMiddlewareRun<{
    status: "author" | "ignore";
  }> {
    if (!ctx.isMessageComponentContext()) {
      return this.next({ status: "ignore" });
    }

    if (!ctx.message.interactionMetadata) {
      return this.next({ status: "ignore" });
    }

    if (ctx.message.interactionMetadata.user.id !== ctx.user.id) {
      return this.cancel(ctx.defer
        ? ctx.editReply(this.message)
        : ctx.reply({ ephemeral: true, ...this.message }),
      );
    }

    return this.next({ status: "author" });
  }
}
