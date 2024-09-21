import { EmbedBuilder } from "discord.js";
import type { ArcClient } from "#/base";

export const internalErrorEmbed = (client: ArcClient, id?: string) => client.defaultMessages.error(id);

export const authorOnly = (): EmbedBuilder => {
  return new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("Author Only")
    .setDescription("This command can only be used by the author of the command.");
};