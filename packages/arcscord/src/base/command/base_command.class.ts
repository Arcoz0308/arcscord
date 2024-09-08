import type { InteractionPreReplyOption } from "#/base/interaction/interaction.type";
import type { ArcClient, BaseCommandRunContext, CommandRunResult } from "#/base";
import type {
  CommandInteraction,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  MessagePayload,
  PermissionsString
} from "discord.js";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";
import { CommandError } from "#/utils";

export type BaseCommandOptions = {
  /**
   * @default []
   */
  neededPermissions?: PermissionsString[];

  /**
   * @default false
   */
  preReply?: boolean;

  /**
   * @default false
   */
  preReplyEphemeral?: boolean;

  /**
   * @default false
   */
  developerCommand?: boolean;
}

export abstract class BaseCommand implements InteractionPreReplyOption {

  preReply: boolean;

  preReplyEphemeral: boolean;

  neededPermissions: PermissionsString[];

  developerCommand: boolean;

  client: ArcClient;

  constructor(client: ArcClient, options?: BaseCommandOptions) {
    this.client = client;

    const optionList = Object.assign<Required<BaseCommandOptions>, BaseCommandOptions | undefined>({
      neededPermissions: [],
      preReply: false,
      preReplyEphemeral: false,
      developerCommand: false,
    }, options);

    this.preReply = optionList.preReply;
    this.preReplyEphemeral = optionList.preReplyEphemeral;
    this.neededPermissions = optionList.neededPermissions;
    this.developerCommand = optionList.developerCommand;
  }

  async preCheck(interaction: CommandInteraction): Promise<Result<boolean, BaseError>> {
    if (this.developerCommand) {
      if (!this.client.arcOptions.developers?.find((v) => v.trim() === interaction.user.id)) {
        return this.baseReply(interaction, this.client.defaultMessages.devOnly, false);
      }
    }

    if (this.neededPermissions.length > 0 && interaction.inGuild()) {

      const missingPermissions = this.neededPermissions.filter((permission) => !interaction.appPermissions.has(permission));
      if (missingPermissions.length > 0) {
        return this.baseReply(interaction, this.client.defaultMessages.missingPermissions(missingPermissions), false);
      }
    }

    return ok(true);
  }

  async reply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionReplyOptions):
    Promise<CommandRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: ctx,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionEditReplyOptions):
    Promise<CommandRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: ctx,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async baseReply(
    interaction: CommandInteraction, message: string | MessagePayload | InteractionReplyOptions, okReturn: boolean
  ): Promise<Result<boolean, BaseError>> {
    try {
      await interaction.reply(message);
      return ok(okReturn);
    } catch (e) {
      return error(new BaseError({
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  error(err: CommandError): CommandRunResult {
    return error(err);
  }

  ok(value: true | string): CommandRunResult {
    return ok(value);
  }

}