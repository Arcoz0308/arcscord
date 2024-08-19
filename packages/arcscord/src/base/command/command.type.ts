import type { CommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";
import type { UserCommandBuilder } from "#/utils/discord/builder/user_command.class";
import type { MessageCommandBuilder } from "#/utils/discord/builder/message_command.class";
import type { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";
import type { Command } from "#/base/command/command.class";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { CommandError } from "#/utils/error/class/command_error";
import type { Result } from "@arcscord/error";

export type CommandRunContext = {
  interaction: CommandInteraction;
  defer: boolean;
  additionalInfos?: Record<string, unknown>;
}

export type SlashCommand = Command & {
  slashBuilder: SlashCmdBuilder| SlashCommandOptionsOnlyBuilder;
}

export type UserCommand = Command & {
  userBuilder: UserCommandBuilder;
}

export type MessageCommand = Command & {
  messageBuilder: MessageCommandBuilder;
}

export type SubSlashCommandList = Record<string, SubCommand|Record<string, SubCommand>>

export type SlashCommandWithSubs = SlashCommand & {
  subsCommands: SubSlashCommandList;
}

export type CommandRunResult = Result<string|true, CommandError>;
export type CommandPreRunResult = Result<false|CommandRunContext, CommandError>


export type PreRunCommand = Command & {
  preRun: (ctx: CommandRunContext) => Promise<CommandPreRunResult>;
}