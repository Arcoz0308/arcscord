import type { InteractionErrorOptions } from "#/utils/error/class/interaction_error";
import { InteractionError } from "#/utils/error/class/interaction_error";
import type { CommandInteraction } from "discord.js";
import type { DebugValueString } from "#/utils/error/error.type";
import type { Command, CommandRunContext } from "#/base/command";
import { commandTypeToString } from "#/base/command";
import { SubCommand } from "#/base/sub_command/sub_command.class";

export type CommandErrorOptions = InteractionErrorOptions & {
  interaction: CommandInteraction;
  context: CommandRunContext;
  command: Command|SubCommand;
}

export class CommandError extends InteractionError {

  interaction: CommandInteraction;

  context: CommandRunContext;

  command: Command|SubCommand;

  constructor(options: CommandErrorOptions) {
    super(options);

    this.name = "CommandError";

    this.interaction = options.interaction;
    this.context = options.context;
    this.command = options.command;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];
    if (this.command instanceof SubCommand) {
      debugs.push(["Command name", this.command.fullName()]);
    } else {
      debugs.push(["Command name", this.interaction.commandName]);
    }

    debugs.push(["Command type", commandTypeToString(this.interaction.commandType)]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}