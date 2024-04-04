import { EmbedBuilder } from "discord.js";

export const internalErrorEmbed = (id?: string):  EmbedBuilder => {
  return new EmbedBuilder()
    .setColor("#ff8000")
    .setTitle("internalError")
    .setDescription("a internal error happened !" + id ? `\nError id : \`${id}\`` : "");
};