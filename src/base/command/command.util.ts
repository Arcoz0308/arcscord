import type { MessageCommand, SlashCommand, UserCommand } from "#/base/command/command.type";
import type { Command } from "#/base/command/command.class";

export const isSlashCommand = (cmd: Command): cmd is SlashCommand => {
  return "slashBuilder" in cmd;
};

export const isUserCommand = (cmd: Command): cmd is UserCommand => {
  return "userBuilder" in cmd;
};

export const isMessageCommand = (cmd: Command): cmd is MessageCommand => {
  return "messageBuilder" in cmd;
};