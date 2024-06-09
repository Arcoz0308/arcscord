import type {
  MessageCommand,
  PreRunCommand,
  SlashCommand,
  SlashCommandWithSubs,
  UserCommand
} from "#/base/command/command.type";
import type { Command } from "#/base/command/command.class";
import { ApplicationCommandType } from "discord-api-types/v10";

export const isSlashCommand = (cmd: Command): cmd is SlashCommand => {
  return "slashBuilder" in cmd;
};

export const isUserCommand = (cmd: Command): cmd is UserCommand => {
  return "userBuilder" in cmd;
};

export const isMessageCommand = (cmd: Command): cmd is MessageCommand => {
  return "messageBuilder" in cmd;
};

export const isCommandWithSubs = (cmd: SlashCommand): cmd is SlashCommandWithSubs => {
  return "subsCommands" in cmd;
};

export const hasPreRun = (cmd: Command): cmd is PreRunCommand => {
  return "preRun" in cmd;
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