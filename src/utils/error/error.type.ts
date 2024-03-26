import type { BaseError } from "#/utils/error/class/base_error.class";
import type {
  BaseInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";
import type { Command, CommandRunContext } from "#/base/command";
import type { SubCommand } from "#/base/sub_command/sub_command.class";

export type ErrorOptions = {
  message?: string;
  baseError?: BaseError|Error;
  debugs?: DebugValues;
}

export type DebugValues = {[key: string]: unknown};
export type DebugValueString = [key: string, value: string];

export type InteractionErrorOptions = ErrorOptions & {
  interaction: BaseInteraction;
}

export type CommandErrorOptions = InteractionErrorOptions & {
  interaction: ChatInputCommandInteraction|MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction;
  context: CommandRunContext;
  command: Command|SubCommand;
}