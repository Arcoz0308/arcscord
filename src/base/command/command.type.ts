import type { ChatInputCommandInteraction } from "discord.js";
import type { UserCommandBuilder } from "#/utils/discord/builder/user_command.class";
import type { MessageCommandBuilder } from "#/utils/discord/builder/message_command.class";
import type { UObject } from "#/utils/type/type";
import type { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";
import type { Command } from "#/base/command/command.class";

export type CommandRunContext<E extends UObject|null = null> = {
  interaction: ChatInputCommandInteraction;
  additionalInfos: E;
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


export type PreRunCommand<E extends UObject|null = null, T extends UObject|null = E> = {
  preRun: (ctx: CommandRunContext<E>) => Promise<CommandRunContext<T>>;
}