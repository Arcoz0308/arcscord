import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ButtonBuilder } from "@discordjs/builders";
import type { ButtonRunContext, ButtonRunResult } from "#/base/message_component/button/button.type";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import { anyToError, ButtonError, error, ok } from "#/utils";

export abstract class Button extends BaseComponent {

  type: ComponentType = "button";

  abstract builder: ComponentBuilderField<ButtonBuilder>;

  authorOnly = false;

  abstract run(ctx: ButtonRunContext): Promise<ButtonRunResult>


  async reply(ctx: ButtonRunContext,  message: string | MessagePayload | InteractionReplyOptions): Promise<ButtonRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new ButtonError({
        interaction: ctx.interaction,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: ButtonRunContext,  message: string | MessagePayload | InteractionEditReplyOptions): Promise<ButtonRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new ButtonError({
        interaction: ctx.interaction,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

}