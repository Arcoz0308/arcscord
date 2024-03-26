import { InteractionError } from "#/utils/error/class/interaction_error.class";
import type {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";
import type { CommandErrorOptions, DebugValueString } from "#/utils/error/error.type";
import { commandTypeToString } from "#/base/command";

export class CommandError extends InteractionError {

  interaction: ChatInputCommandInteraction|MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction;

  constructor(options: CommandErrorOptions) {
    super(options);

    this.interaction = options.interaction;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];
    debugs.push(["command name", this.interaction.commandName]);
    debugs.push(["Command type", commandTypeToString(this.interaction.commandType)]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}