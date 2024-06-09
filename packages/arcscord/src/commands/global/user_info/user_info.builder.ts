import { UserCommandBuilder } from "#/utils/discord/builder/user_command.class";
import { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";

export const userUserInfoBuilder = new UserCommandBuilder()
  .setName("userinfo");

export const slashUserInfoBuilder = new SlashCmdBuilder()
  .setName("userinfo")
  .setDescription("get user info")
  .addUserOption((b) => b.setName("user")
    .setDescription("the user (optional)")
    .setRequired(false));