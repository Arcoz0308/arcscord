import type { CommandRunContext, CommandRunResult, SubSlashCommandList } from "#/base/command/command.type";
import { InteractionBase } from "#/base/interaction/interaction.class";
import { isCommandWithSubs, isSlashCommand } from "#/base/command/command.util";
import { CommandError } from "#/utils/error/class/command_error";
import { SubCommand } from "#/base/sub_command/sub_command.class";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import { anyToError, error, ok } from "@arcscord/error";

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
          debugs: { subs: JSON.stringify(Object.keys(list)) },
        }));
      }

      const nList = list[subCommandGroup];
      if (nList instanceof SubCommand) {
        return error(new CommandError({
          message: `subCommand group ${subCommandGroup} only exist in sub command...`,
          interaction: ctx.interaction,
          command: this,
          context: ctx,
          debugs: { subs: JSON.stringify(Object.keys(list)) },
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
        debugs: { subs: JSON.stringify(Object.keys(list)) },
      }));
    }

    if (!Object.keys(list).includes(subCommandName)) {
      return error(new CommandError({
        message: `subCommand ${subCommandName} not found`,
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        debugs: { subs: JSON.stringify(Object.keys(list)) },
      }));
    }

    const sub = list[subCommandName];
    if (!(sub instanceof SubCommand) || !sub) {
      return error(new CommandError({
        message: `subCommand ${subCommandName} don't have class SubCommand`,
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        debugs: { subs: JSON.stringify(Object.keys(list)) },
      }));

    }

    return sub.run(ctx);
  }

  async reply(ctx: CommandRunContext,  message: string | MessagePayload | InteractionReplyOptions): Promise<CommandRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: CommandRunContext,  message: string | MessagePayload | InteractionEditReplyOptions): Promise<CommandRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        interaction: ctx.interaction,
        command: this,
        context: ctx,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        baseError: anyToError(e),
      }));
    }
  }

  error(err: CommandError): CommandRunResult {
    return error(err);
  }

  ok(value: true|string): CommandRunResult {
    return ok(value);
  }

}