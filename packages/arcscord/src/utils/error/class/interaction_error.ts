import type { ErrorOptions } from "@arcscord/better-error";
import type { BaseInteraction } from "discord.js";
import { BaseError } from "@arcscord/better-error";

export type InteractionErrorOptions = ErrorOptions & {
  interaction: BaseInteraction;
};

export class InteractionError extends BaseError {
  name = "InteractionError";

  interaction: BaseInteraction;

  constructor(options: InteractionErrorOptions) {
    super(options);

    this.interaction = options.interaction;

    const channelInfos
      = options.interaction.channel && !options.interaction.channel.isDMBased()
        ? {
            name: options.interaction.channel.name,
            id: options.interaction.channel.id,
          }
        : { name: "inDm", id: options.interaction.user.id };

    this._debugs.set(
      "RunInfos",
      `Author:'${options.interaction.user.username}' (${options.interaction.user.id}) `
      + `Channel:'${channelInfos.name}' (${channelInfos.id}) `
      + `${options.interaction.guild ? `GuildId:'${options.interaction.guild.id}'` : ""}`,
    );
  }
}
