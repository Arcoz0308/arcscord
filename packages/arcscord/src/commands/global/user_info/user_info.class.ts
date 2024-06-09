import type { CommandRunContext, CommandRunResult, SlashCommand, UserCommand } from "#/base/command";
import { Command } from "#/base/command";
import { slashUserInfoBuilder, userUserInfoBuilder } from "#/commands/global/user_info/user_info.builder";

export class UserInfoCommand extends Command implements UserCommand, SlashCommand {

  name = "userinfo";

  userBuilder = userUserInfoBuilder;

  slashBuilder = slashUserInfoBuilder;

  run(ctx: CommandRunContext): Promise<CommandRunResult> {
    let user = ctx.interaction.user;
    if (ctx.interaction.isUserContextMenuCommand()) {
      user = ctx.interaction.targetUser;
    } else if (ctx.interaction.isChatInputCommand()) {
      user = ctx.interaction.options.getUser("user", false) || user;
    }


    return this.reply(ctx, {
      content: `username : ${user.username}`,
      ephemeral: true,
    });
  }

}