import type { ArcClient, CommandHandler } from "#/base";
import type { BaseInteraction, Guild, GuildBasedChannel, GuildMember, Message, User } from "discord.js";

/**
 * FOR DOCS ONLY
 */
export type ContextDocs = {
  /**
   * The client instance.
   */
  client: ArcClient;

  /**
   * The user involved in the interaction.
   */
  user: User;

  /**
   * ResolvedName of the command by Arcscord
   * @see {@link CommandManager.resolveCommandName}
   */
  resolvedCommandName: string;

  /**
   * The command props for the command
   */
  command: CommandHandler;

  /**
   * The discord.js Interaction object
   */
  interaction: BaseInteraction;
};

/**
 * FOR DOCS ONLY
 */
export type ContextInGuild = {
  /**
   * ID of the guild.
   */
  guildId: string;

  /**
   * The guild object.
   */
  guild: Guild;

  /**
   * ID of the channel.
   */
  channelId: string;

  /**
   * The channel object.
   */
  channel: GuildBasedChannel;

  /**
   * The member object.
   */
  member: GuildMember;

  /**
   * Indicates the interaction is within a guild.
   */
  inGuild: () => true;

  /**
   * Indicates the interaction is not within a direct message.
   */
  inDM: () => false;
};

/**
 * FOR DOCS ONLY
 */
export type ContextInDm = {
  /**
   * ID of the guild (null for direct messages).
   */
  guildId: null;

  /**
   * The guild object (null for direct messages).
   */
  guild: null;

  /**
   * ID of the channel (null for direct messages).
   */
  channelId: null;

  /**
   * The channel object (null for direct messages).
   */
  channel: null;

  /**
   * The member object (null for direct messages).
   */
  member: null;

  /**
   * Indicates the interaction is not within a guild.
   */
  inGuild: () => false;

  /**
   * Indicates the interaction is within a direct message.
   */
  inDM: () => true;
};

export type ContextInGuildOrDm = ContextInGuild | ContextInDm;

/**
 * FOR DOCS ONLY
 */
export type CommandContextDocs = {
  /**
   * The type of command interaction.
   * "slash" indicates a slash command.
   * "message" indicates a message-based command.
   * "user" indicates a user-based command.
   */
  readonly type: "slash" | "message" | "user";

  /**
   * Indicates if the command is a slash command.
   */
  readonly isSlashCommand: boolean;

  /**
   * Indicates if the command is a message-based command.
   */
  readonly isMessageCommand: boolean;

  /**
   * Indicates if the command is a user-based command.
   */
  readonly isUserCommand: boolean;
};

/**
 * FOR DOCS ONLY
 */
export type SlashCommandContextDocs = {
  /**
   * typed command options values
   */
  options: unknown;
};

export type MessageCommandContextDocs = {
  /**
   * The message that the command target
   */
  targetMessage: Message;
};
