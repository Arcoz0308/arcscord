import { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";

export const infoSlashBuilder = new SlashCmdBuilder()
  .setName("info")
  .setDescription("get infos about the bot");