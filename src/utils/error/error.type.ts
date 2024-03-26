import type { BaseError } from "#/utils/error/class/base_error.class";
import type {
  BaseInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

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
}