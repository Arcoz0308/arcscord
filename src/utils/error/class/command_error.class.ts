import { InteractionError } from "#/utils/error/class/interaction_error.class";
import type {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";
import type { CommandErrorOptions, DebugValueString } from "#/utils/error/error.type";
import type { Command, CommandRunContext } from "#/base/command";
import { commandTypeToString } from "#/base/command";
import { SubCommand } from "#/base/sub_command/sub_command.class";

export class CommandError extends InteractionError {

  interaction: ChatInputCommandInteraction|MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction;

  context: CommandRunContext;

  command: Command|SubCommand;

  constructor(options: CommandErrorOptions) {
    super(options);

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