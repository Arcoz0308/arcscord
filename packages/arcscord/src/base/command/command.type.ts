import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction,
  User,
  UserContextMenuCommandInteraction
} from "discord.js";
import { type InteractionEditReplyOptions, type InteractionReplyOptions, type MessagePayload } from "discord.js";
import type { Command } from "#/base/command/command.class";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { CommandError, CommandErrorOptions } from "#/utils/error/class/command_error";
import type { Result } from "@arcscord/error";
import type {
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SlashOptionsCommandDefinition,
  SubCommandDefinition
} from "#/base/command/command_definition.type";
import type { ContextOptions, OptionsList } from "#/base/command/option.type";
import type {
  APIModalSubmission,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord-api-types/v10";

export type CommandType = "slash" | "user" | "message";

export type BaseCommandRunContext = {
  interaction: CommandInteraction;
  defer: boolean;
  user: User;
  command: Command | SubCommand;
  type: CommandType;
  reply: (message: string | MessagePayload | InteractionReplyOptions) => Promise<CommandRunResult>;
  editReply: (message: string | MessagePayload | InteractionEditReplyOptions) => Promise<CommandRunResult>;
  ok: (value: string | true) => Promise<CommandRunResult>;
  error: (options: Omit<CommandErrorOptions, "ctx"> | string) => Promise<CommandRunResult>;
}

export type CommandRunContextFunctions = {
  reply: (message: string | MessagePayload | InteractionReplyOptions) => Promise<CommandRunResult>;
  editReply: (message: string | MessagePayload | InteractionEditReplyOptions) => Promise<CommandRunResult>;
  ok: (value: string | true) => Promise<CommandRunResult>;
  error: (options: Omit<CommandErrorOptions, "ctx"> | string) => Promise<CommandRunResult>;
  showModal: (modal: APIModalSubmission) => Promise<CommandRunResult>;
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

export type SlashCommandRunContextWithOption<T extends OptionsList> = BaseCommandRunContext & {
  type: "slash";
  interaction: ChatInputCommandInteraction;
  isSlashCommand: true;
  isUSerCommand: false;
  isMessageCommand: false;
  options: ContextOptions<T>;
}

export type SlashCommandRunContextWithoutOption = BaseCommandRunContext & {
  type: "slash";
  interaction: ChatInputCommandInteraction;
  isSlashCommand: true;
  isUSerCommand: false;
  isMessageCommand: false;
  options: undefined;
}
export type SlashCommandRunContext<T extends OptionsList | undefined> = T extends OptionsList ?
  SlashCommandRunContextWithOption<T> : SlashCommandRunContextWithoutOption;

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
  type: "message";
  interaction: MessageContextMenuCommandInteraction;
  targetMessage: Message;
  isSlashCommand: false;
  isUSerCommand: false;
  isMessageCommand: true;
}

export type CommandRunContext<T extends FullCommandDefinition> = (
  (T extends PartialCommandDefinitionForSlash ?
    (SlashCommandRunContext<
      (T["slash"] extends SlashOptionsCommandDefinition ? T["slash"]["options"] : undefined)
    > & (DmCommandRunContextInfos | GuildCommandRunContextInfos)) : never)

  | (T extends PartialCommandDefinitionForUser ?
  (UserCommandRunContext & (DmCommandRunContextInfos | GuildCommandRunContextInfos)) : never)

  | (T extends PartialCommandDefinitionForMessage ?
  ((MessageCommandRunContext & (DmCommandRunContextInfos | GuildCommandRunContextInfos))) : never));

export type SubCommandRunContext<T extends SubCommandDefinition> = (SlashCommandRunContext<T["options"]> & (
  DmCommandRunContextInfos | GuildCommandRunContextInfos
  )) & BaseCommandRunContext;

export type CommandRunResult = Result<string|true, CommandError>;

export type APICommandObject = {
  slash?: RESTPostAPIChatInputApplicationCommandsJSONBody;
  message?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  user?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
}