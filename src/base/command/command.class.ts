import type { CommandRunContext, CommandRunResult, SubSlashCommandList } from "#/base/command/command.type";
import { InteractionBase } from "#/base/interaction/interaction.class";
import { isCommandWithSubs, isSlashCommand } from "#/base/command/command.util";
import { error } from "#/utils/error/error.util";
import { CommandError } from "#/utils/error/class/command_error.class";
import { SubCommand } from "#/base/sub_command/sub_command.class";

export abstract class Command extends InteractionBase {


  abstract run(ctx: CommandRunContext): Promise<CommandRunResult>

  // eslint-disable-next-line @typescript-eslint/require-await
  async handleSubCommands(ctx: CommandRunContext): Promise<CommandRunResult> {
    if (!isSlashCommand(this) || !isCommandWithSubs(this)) {
      return error(new CommandError({
        message: "invalid command for handle subCommands !",
        interaction: ctx.interaction,
        command: this,
        context: ctx,
      }));
    }

    if (!ctx.interaction.isChatInputCommand()) {
      return error(new CommandError({
        message: "get interaction for no slash command interaction",
        interaction: ctx.interaction,
        command: this,
        context: ctx,
      }));
    }

    let list: SubSlashCommandList| Record<string, SubCommand> = this.subsCommands;

    const subCommandGroup = ctx.interaction.options.getSubcommandGroup(false);
    if (subCommandGroup) {
      if (!Object.keys(list).includes(subCommandGroup)) {
        return error(new CommandError({
          message: `subCommand group ${subCommandGroup} not found`,
          interaction: ctx.interaction,
          command: this,
          context: ctx,
          debugs: { subs: JSON.stringify(list) },
        }));
      }

      const nList = list[subCommandGroup];
      if (nList instanceof SubCommand) {
        return error(new CommandError({
          message: `subCommand group ${subCommandGroup} only exist in sub command...`,
          interaction: ctx.interaction,
          command: this,
          context: ctx,
          debugs: { subs: JSON.stringify(list) },
        }));
      }

      list = nList;
    }

    const subCommandName = ctx.interaction.options.getSubcommand(false);
    if (!subCommandName) {
      return error(new CommandError({
        message: "subCommand not found",
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        debugs: { subs: JSON.stringify(list) },
      }));
    }

    if (!Object.keys(list).includes(subCommandName)) {
      return error(new CommandError({
        message: `subCommand ${subCommandName} not found`,
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        debugs: { subs: JSON.stringify(list) },
      }));
    }

    const sub = list[subCommandName];
    if (!(sub instanceof SubCommand)) {
      return error(new CommandError({
        message: `subCommand ${subCommandName} don't have class SubCommand`,
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        debugs: { subs: JSON.stringify(list) },
      }));

    }

    return sub.run(ctx);
  }

}