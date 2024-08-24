import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  User,
  UserContextMenuCommandInteraction
} from "discord.js";
import { type InteractionEditReplyOptions, type InteractionReplyOptions, type MessagePayload } from "discord.js";
import type { UserCommandBuilder } from "#/utils/discord/builder/user_command.class";
import type { MessageCommandBuilder } from "#/utils/discord/builder/message_command.class";
import type { SlashCmdBuilder } from "#/utils/discord/builder/slash_cmd.class";
import type { Command } from "#/base/command/command.class";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { CommandError, CommandErrorOptions } from "#/utils/error/class/command_error";
import type { Result } from "@arcscord/error";

export type CommandType = "slash" | "user" | "msg";


export type BaseCommandRunContext = {
  interaction: CommandInteraction;
  defer: boolean;
  user: User;
  reply: (message: string | MessagePayload | InteractionReplyOptions) => Promise<CommandRunResult>;
  editReply: (message: string | MessagePayload | InteractionEditReplyOptions) => Promise<CommandRunResult>;
  command: Command | SubCommand;
  type: CommandType;
  ok: (value: string | true) => Promise<CommandRunResult>;
  error: (options: Omit<CommandErrorOptions, "ctx"> | string) => Promise<CommandRunResult>;
}

export type GuildCommandRunContextInfos = {
  guild: Guild;
  channel: GuildBasedChannel;
  member: GuildMember;
  inGuild: true;
}

export type DmCommandRunContextInfos = {
  guild: null;
  channel: null;
  member: null;
  inGuild: false;
}

export type SlashCommandRunContext = BaseCommandRunContext & {
  type: "slash";
  interaction: ChatInputCommandInteraction;
  options: ChatInputCommandInteraction["options"];
  isSlashCommand: true;
  isUSerCommand: false;
  isMessageCommand: false;
}

export type UserCommandRunContext = BaseCommandRunContext & {
  type: "user";
  interaction: UserContextMenuCommandInteraction;
  targetUser: User;
  targetMember: GuildMember | null;
  isSlashCommand: false;
  isUSerCommand: true;
  isMessageCommand: false;
}

export type MessageCommandRunContext = BaseCommandRunContext & {
  type: "msg";
  interaction: MessageContextMenuCommandInteraction;
  targetMessage: Message;
  isSlashCommand: false;
  isUSerCommand: false;
  isMessageCommand: true;
}


export type CommandRunContext = (
  (SlashCommandRunContext & (DmCommandRunContextInfos | GuildCommandRunContextInfos)) |
  (UserCommandRunContext & (DmCommandRunContextInfos | GuildCommandRunContextInfos)) |
  (MessageCommandRunContext & (DmCommandRunContextInfos | GuildCommandRunContextInfos)));


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