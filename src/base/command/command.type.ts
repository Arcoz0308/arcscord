import type { ChatInputCommandInteraction } from "discord.js";
import type { UserCommandBuilder } from "#/utils/discord/builder/user_command.class";
import type { MessageCommandBuilder } from "#/utils/discord/builder/message_command.class";
import type { UObject } from "#/utils/type/type";
import type { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";
import type { Command } from "#/base/command/command.class";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { Result } from "#/utils/error/error.type";
import type { CommandError } from "#/utils/error/class/command_error.class";

export type CommandRunContext = {
  interaction: ChatInputCommandInteraction;
  additionalInfos: UObject;
}

export type SlashCommand = Command & {
  slashBuilder: SlashCmdBuilder;
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

export type CommandRunResult = Result<boolean, CommandError>;
export type CommandPreRunResult = Result<false|CommandRunContext, CommandError>


export type PreRunCommand = {
  preRun: (ctx: CommandRunContext) => Promise<CommandPreRunResult>;
}