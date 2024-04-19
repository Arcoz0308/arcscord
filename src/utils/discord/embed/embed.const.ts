import { EmbedBuilder } from "discord.js";

export const internalErrorEmbed = (id?: string):  EmbedBuilder => {
  return new EmbedBuilder()
    .setColor("#ff8000")
    .setTitle("internalError")
    .setDescription("a internal error happened !" + id ? `\nError id : \`${id}\`` : "");
};

export const authorOnly = (): EmbedBuilder => {
  return new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle("Author Only")
    .setDescription("This command can only be used by the author of the command.");
};