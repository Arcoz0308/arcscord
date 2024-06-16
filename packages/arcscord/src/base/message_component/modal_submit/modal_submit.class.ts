import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ModalBuilder } from "@discordjs/builders";
import type {
  ModalSubmitRunContext,
  ModalSubmitRunResult
} from "#/base/message_component/modal_submit/modal_submit.type";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import { anyToError, error, ModalSubmitError, ok } from "#/utils";

export abstract class ModalSubmitComponent extends BaseComponent {

  type: ComponentType = "modalSubmit";

  abstract builder: ComponentBuilderField<ModalBuilder>

  abstract run(ctx: ModalSubmitRunContext): Promise<ModalSubmitRunResult>;


  async reply(ctx: ModalSubmitRunContext,  message: string | MessagePayload | InteractionReplyOptions): Promise<ModalSubmitRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new ModalSubmitError({
        interaction: ctx.interaction,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: ModalSubmitRunContext,  message: string | MessagePayload | InteractionEditReplyOptions): Promise<ModalSubmitRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new ModalSubmitError({
        interaction: ctx.interaction,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

  error(err: ModalSubmitError): ModalSubmitRunResult {
    return error(err);
  }

  ok(value: true|string): ModalSubmitRunResult {
    return ok(value);
  }

}