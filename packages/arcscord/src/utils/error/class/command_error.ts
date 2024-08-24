import { InteractionError } from "#/utils/error/class/interaction_error";
import type { CommandInteraction } from "discord.js";
import type { Command, CommandRunContext } from "#/base/command";
import { commandInteractionToString } from "#/base/command";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { ErrorOptions } from "@arcscord/better-error";

export type CommandErrorOptions = ErrorOptions & {
  ctx: CommandRunContext;
}

export class CommandError extends InteractionError {

  name = "CommandError";

  interaction: CommandInteraction;

  context: CommandRunContext;

  command: Command|SubCommand;

  constructor(options: CommandErrorOptions) {
    super({ ...options, interaction: options.ctx.interaction });

    this.interaction = options.ctx.interaction;
    this.context = options.ctx;
    this.command = options.ctx.command;
    this._debugs.set("Command", commandInteractionToString(options.ctx.interaction));
  }

}