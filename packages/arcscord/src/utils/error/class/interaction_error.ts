import type { ErrorOptions } from "@arcscord/better-error";
import type { BaseInteraction } from "discord.js";
import { BaseError } from "@arcscord/better-error";

/**
 * Options for interaction-related errors
 */
export type InteractionErrorOptions = ErrorOptions & {
  /**
   * The interaction associated with the error.
   */
  interaction: BaseInteraction;
};

/**
 * Represents an error related to a Discord interaction.
 */
export class InteractionError extends BaseError {
  /**
   * The name of the error.
   */
  name = "InteractionError";

  /**
   * The interaction associated with the error.
   */
  interaction: BaseInteraction;

  /**
   * Creates a new instance of `InteractionError`.
   *
   * @param options - The options for creating the interaction error.
   */
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
