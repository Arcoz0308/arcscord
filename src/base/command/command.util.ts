import type { MessageCommand, SlashCommand, UserCommand } from "#/base/command/command.type";
import type { Command } from "#/base/command/command.class";
import { ApplicationCommandType } from "discord-api-types/v10";
import type { SubCommand } from "#/base/sub_command/sub_command.class";

export const isSlashCommand = (cmd: Command): cmd is SlashCommand => {
  return "slashBuilder" in cmd;
};

export const isUserCommand = (cmd: Command): cmd is UserCommand => {
  return "userBuilder" in cmd;
};

export const isMessageCommand = (cmd: Command): cmd is MessageCommand => {
  return "messageBuilder" in cmd;
};

export const commandTypeToString = (type: ApplicationCommandType): string => {
  switch (type) {
    case ApplicationCommandType.ChatInput:
      return "Slash Command";
    case ApplicationCommandType.Message:
      return "Message Command";
    case ApplicationCommandType.User:
      return "User Command";
    default:
      return "Unknown Command type";
  }
};

export const subCommandNameToString = (command: SubCommand): string => {
  if (command.subGroup !== null) {
    return `${command.name}-${command.subGroup}-${command.subName}`;
  }
  return `${command.name}-${command.subName}`;
};