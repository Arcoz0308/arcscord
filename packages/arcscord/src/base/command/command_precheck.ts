import type { CommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";
import type { ArcClient, CommandOptions } from "#/base";
import type { MaybePromise } from "#/utils/type/util.type";

export const baseReply = async(
  interaction: CommandInteraction, message: string | MessagePayload | InteractionReplyOptions, okReturn: boolean
): Promise<Result<boolean, BaseError>> => {
  try {
    await interaction.reply(message);
    return ok(okReturn);
  } catch (e) {
    return error(new BaseError({
      message: `failed to reply to interaction : ${anyToError(e).message}`,
      originalError: anyToError(e),
    }));
  }
};

export const preCheck = (
  options: CommandOptions,
  client: ArcClient,
  interaction: CommandInteraction
): MaybePromise<Result<boolean, BaseError>> => {
  if (options.developerCommand) {
    if (!client.arcOptions.developers?.find((v) => v.trim() === interaction.user.id)) {
      return baseReply(interaction, client.defaultMessages.devOnly, false);
    }
  }

  const neededPermissions = options.neededPermissions || [];
  if (neededPermissions.length > 0 && interaction.inGuild()) {

    const missingPermissions = neededPermissions.filter((permission) => !interaction.appPermissions.has(permission));
    if (missingPermissions.length > 0) {
      return baseReply(interaction, client.defaultMessages.missingPermissions(missingPermissions), false);
    }
  }

  return ok(true);
};