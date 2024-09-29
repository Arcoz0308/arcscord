import type {
  CommandContexts,
  CommandIntegrationType,
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SubCommandDefinition
} from "#/base/command/command_definition.type";
import type { ArcClient, Command, CommandRunResult, SubCommand } from "#/base";
import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  InteractionDeferReplyOptions,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  Message,
  MessageContextMenuCommandInteraction,
  MessagePayload,
  ModalComponentData,
  User,
  UserContextMenuCommandInteraction
} from "discord.js";
import { InteractionContextType } from "discord.js";
import type { CommandErrorOptions } from "#/utils";
import { CommandError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";
import type { ContextOptions, OptionsList } from "#/base/command/option.type";


export type BaseCommandContextBuilderOptions = {
  resolvedName: string;
}

export type CommandClassType<T extends FullCommandDefinition | SubCommandDefinition> =
  T extends FullCommandDefinition ? Command<T> :
    T extends SubCommandDefinition ? SubCommand<T> : never;

export class BaseCommandContext<T extends FullCommandDefinition | SubCommandDefinition = FullCommandDefinition | SubCommandDefinition> {

  /**
   * the command class
   */
  command: CommandClassType<T>;

  /**
   * djs original interaction
   */
  interaction: CommandInteraction;

  user: User;

  interactionContext: CommandContexts | null;

  interactionSource: CommandIntegrationType;

  defer: boolean = false;

  client: ArcClient;

  resolvedCommandName: string;

  constructor(command: CommandClassType<T>, interaction: CommandInteraction, options: BaseCommandContextBuilderOptions) {
    this.command = command;
    this.interaction = interaction;

    this.user = interaction.user;

    this.interactionContext = this.#interactionContextConverter(interaction.context);
    this.interactionSource = interaction.authorizingIntegrationOwners["0"] ? "guildInstall" : "userInstall";

    this.client = command.client;

    this.resolvedCommandName = options.resolvedName;
  }

  async reply(message: string, options?: Omit<InteractionReplyOptions, "content">): Promise<CommandRunResult>;

  async reply(options: MessagePayload | InteractionReplyOptions): Promise<CommandRunResult>;

  async reply(message: string | MessagePayload | InteractionReplyOptions, options?: Omit<InteractionReplyOptions, "content">):
    Promise<CommandRunResult> {
    try {

      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: this,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async editReply(message: string, options?: Omit<InteractionEditReplyOptions, "content">): Promise<CommandRunResult>;

  async editReply(options: MessagePayload | InteractionEditReplyOptions): Promise<CommandRunResult>;

  async editReply(message: string | MessagePayload | InteractionEditReplyOptions, options?: Omit<InteractionReplyOptions, "content">):
    Promise<CommandRunResult> {
    try {

      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: this,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async deferReply(options: InteractionDeferReplyOptions): Promise<CommandRunResult> {
    try {
      await this.interaction.deferReply(options);
      this.defer = true;
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: this,
        message: `failed to defer reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async showModal(modal: ModalComponentData): Promise<CommandRunResult> {
    try {
      await this.interaction.showModal(modal);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: this,
        message: `failed to show modal : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  ok(value: string | true): CommandRunResult {
    return ok(value);
  }

  error(options: Omit<CommandErrorOptions, "ctx">): CommandRunResult {
    return error(new CommandError({ ...options, ctx: this }));
  }

  async multiple(...funcList: Promise<CommandRunResult>[]): Promise<CommandRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }


  #interactionContextConverter(ctx: InteractionContextType | null): CommandContexts | null {
    switch (ctx) {
      case null:
        return null;
      case InteractionContextType.BotDM:
        return "botDm";
      case InteractionContextType.Guild:
        return "guild";
      case InteractionContextType.PrivateChannel:
        return "privateChannel";
      default:
        return null;
    }
  }

}

export type GuildCommandContextBuilderOptions = BaseCommandContextBuilderOptions & {
  guild: Guild;
  channel: GuildBasedChannel;
  member: GuildMember;
};

export class GuildCommandContext<
  T extends FullCommandDefinition | SubCommandDefinition = FullCommandDefinition | SubCommandDefinition
> extends BaseCommandContext<T> {

  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(command: CommandClassType<T>, interaction: CommandInteraction, options: GuildCommandContextBuilderOptions) {
    super(command, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }

}

export class DmCommandContext<
  T extends FullCommandDefinition | SubCommandDefinition = FullCommandDefinition | SubCommandDefinition
> extends BaseCommandContext<T> {

  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;

}

type ContextOptionsDef<T extends PartialCommandDefinitionForSlash | SubCommandDefinition> = (
  T extends PartialCommandDefinitionForSlash ?
    T["slash"]["options"] extends OptionsList ? ContextOptions<T["slash"]["options"]> : null
    : T extends SubCommandDefinition ?
      T["options"] extends OptionsList ? ContextOptions<T["options"]> : null : never);


export type GuildSlashCommandContextBuilderOptions<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = PartialCommandDefinitionForSlash | SubCommandDefinition
> = GuildCommandContextBuilderOptions & {
  options: ContextOptionsDef<T>;
}

export class GuildSlashCommandContext<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = PartialCommandDefinitionForSlash | SubCommandDefinition
> extends GuildCommandContext<T> {

  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: ChatInputCommandInteraction, options: GuildSlashCommandContextBuilderOptions<T>) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }

}

export type GuildMessageCommandContextBuilderOptions = GuildCommandContextBuilderOptions & {
  message: Message;
}

export class GuildMessageCommandContext<
  T extends PartialCommandDefinitionForMessage = PartialCommandDefinitionForMessage
> extends GuildCommandContext<T> {

  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: MessageContextMenuCommandInteraction, options: GuildMessageCommandContextBuilderOptions) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }

}

export type GuildUserCommandContextBuilderOptions = GuildCommandContextBuilderOptions & {
  targetUser: User;
  targetMember: GuildMember | null;
}

export class GuildUserCommandContext<
  T extends PartialCommandDefinitionForUser = PartialCommandDefinitionForUser
> extends GuildCommandContext<T> {

  targetUser: User;

  targetMember: GuildMember | null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: UserContextMenuCommandInteraction, options: GuildUserCommandContextBuilderOptions) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;
    this.targetMember = options.targetMember;

    this.interaction = interaction;
  }

}

export type DmSlashCommandContextBuilderOptions<
  T extends (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition =
      PartialCommandDefinitionForSlash | SubCommandDefinition
> = BaseCommandContextBuilderOptions & {
  options: ContextOptionsDef<T>;
}

export class DmSlashCommandContext<
  T extends (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition =
      (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition
> extends DmCommandContext<T> {

  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: ChatInputCommandInteraction, options: DmSlashCommandContextBuilderOptions<T>) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }

}

export type DmMessageCommandContextBuilderOptions = BaseCommandContextBuilderOptions & {
  message: Message;
}

export class DmMessageCommandContext<
  T extends PartialCommandDefinitionForMessage = PartialCommandDefinitionForMessage
> extends DmCommandContext<T> {

  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: MessageContextMenuCommandInteraction, options: DmMessageCommandContextBuilderOptions) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }

}

export type DmUserCommandContextBuilderOptions = BaseCommandContextBuilderOptions & {
  targetUser: User;
}

export class DmUserCommandContext<
  T extends PartialCommandDefinitionForUser = PartialCommandDefinitionForUser
> extends DmCommandContext<T> {

  targetUser: User;

  targetMember = null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(command: CommandClassType<T>, interaction: UserContextMenuCommandInteraction, options: DmUserCommandContextBuilderOptions) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;

    this.interaction = interaction;
  }

}

export type CommandContext<
  T extends FullCommandDefinition | SubCommandDefinition = FullCommandDefinition | SubCommandDefinition
> =
  T extends FullCommandDefinition ? (
    | (T extends PartialCommandDefinitionForSlash ? GuildSlashCommandContext<T> | DmSlashCommandContext<T> : never)
    | (T extends PartialCommandDefinitionForMessage ? GuildMessageCommandContext<T> | DmMessageCommandContext<T> : never)
    | (T extends PartialCommandDefinitionForUser ? GuildUserCommandContext<T> | DmUserCommandContext<T> : never)
    ) : T extends SubCommandDefinition ?
    GuildSlashCommandContext<T> | DmSlashCommandContext<T> : never;