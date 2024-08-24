import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentType } from "#/base/message_component/base/base_component.type";
import type { SelectMenuRunContext, SelectMenuRunResult } from "#/base/message_component/select_menu/select_menu.type";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import { SelectMenuError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";

export abstract class SelectMenu extends BaseComponent {

  type: ComponentType = "selectMenu";

  authorOnly: boolean = false;

  abstract run(ctx: SelectMenuRunContext): Promise<SelectMenuRunResult>

  async reply(ctx: SelectMenuRunContext,  message: string | MessagePayload | InteractionReplyOptions): Promise<SelectMenuRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new SelectMenuError({
        interaction: ctx.interaction,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: SelectMenuRunContext,  message: string | MessagePayload | InteractionEditReplyOptions): Promise<SelectMenuRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new SelectMenuError({
        interaction: ctx.interaction,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  error(err: SelectMenuError): SelectMenuRunResult {
    return error(err);
  }

  ok(value: true|string): SelectMenuRunResult {
    return ok(value);
  }

}