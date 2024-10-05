import type {
  CommandContexts,
  CommandIntegrationType,
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SubCommandDefinition
} from "#/base/command/command_definition.type";
import type { ArcClient, CommandProps, CommandRunResult } from "#/base";
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
import type { CommandMiddleware } from "#/base/command/command_middleware";

export type MiddlewaresResults<M extends CommandMiddleware[]> = {
  [K in M[number] as K["name"]]: NonNullable<Awaited<ReturnType<K["run"]>>["next"]>;
}

export type BaseCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> = {
  resolvedName: string;
  additional?: MiddlewaresResults<M>;
  client: ArcClient;
}

export class BaseCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[]
> {

  /**
   * the command class
   */
  command: CommandProps;

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

  additional: MiddlewaresResults<M>;

  constructor(command: CommandProps, interaction: CommandInteraction, options: BaseCommandContextBuilderOptions<M>) {
    this.command = command;
    this.interaction = interaction;

    this.user = interaction.user;

    this.interactionContext = this.#interactionContextConverter(interaction.context);
    this.interactionSource = interaction.authorizingIntegrationOwners["0"] ? "guildInstall" : "userInstall";

    this.client = options.client;

    this.resolvedCommandName = options.resolvedName;
    this.additional = options.additional || {} as MiddlewaresResults<M>;
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

export type GuildCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> =
  BaseCommandContextBuilderOptions<M>
  & {
  guild: Guild;
  channel: GuildBasedChannel;
  member: GuildMember;
};

export class GuildCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> {

  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(command: CommandProps, interaction: CommandInteraction, options: GuildCommandContextBuilderOptions<M>) {
    super(command, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }

}

export class DmCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> {

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
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = PartialCommandDefinitionForSlash | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[]
> = GuildCommandContextBuilderOptions<M> & {
  options: ContextOptionsDef<T>;
}

export class GuildSlashCommandContext<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = PartialCommandDefinitionForSlash | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> {

  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(command: CommandProps, interaction: ChatInputCommandInteraction, options: GuildSlashCommandContextBuilderOptions<T, M>) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }

}

export type GuildMessageCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> =
  GuildCommandContextBuilderOptions<M>
  & {
  message: Message;
}

export class GuildMessageCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> {

  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(command: CommandProps, interaction: MessageContextMenuCommandInteraction, options: GuildMessageCommandContextBuilderOptions<M>) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }

}

export type GuildUserCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> =
  GuildCommandContextBuilderOptions<M>
  & {
  targetUser: User;
  targetMember: GuildMember | null;
}

export class GuildUserCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> {

  targetUser: User;

  targetMember: GuildMember | null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(command: CommandProps, interaction: UserContextMenuCommandInteraction, options: GuildUserCommandContextBuilderOptions<M>) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;
    this.targetMember = options.targetMember;

    this.interaction = interaction;
  }

}

export type DmSlashCommandContextBuilderOptions<
  T extends (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition =
      PartialCommandDefinitionForSlash | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[]
> = BaseCommandContextBuilderOptions<M> & {
  options: ContextOptionsDef<T>;
}

export class DmSlashCommandContext<
  T extends (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition =
      (PartialCommandDefinitionForSlash & FullCommandDefinition) | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> {

  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(command: CommandProps, interaction: ChatInputCommandInteraction, options: DmSlashCommandContextBuilderOptions<T, M>) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }

}

export type DmMessageCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> =
  BaseCommandContextBuilderOptions<M>
  & {
  message: Message;
}

export class DmMessageCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> {

  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(command: CommandProps, interaction: MessageContextMenuCommandInteraction, options: DmMessageCommandContextBuilderOptions<M>) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }

}

export type DmUserCommandContextBuilderOptions<M extends CommandMiddleware[] = CommandMiddleware[]> =
  BaseCommandContextBuilderOptions<M>
  & {
  targetUser: User;
}

export class DmUserCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> {

  targetUser: User;

  targetMember = null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(command: CommandProps, interaction: UserContextMenuCommandInteraction, options: DmUserCommandContextBuilderOptions<M>) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;

    this.interaction = interaction;
  }

}

export type CommandContext<
  T extends FullCommandDefinition | SubCommandDefinition = FullCommandDefinition | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> =
  T extends FullCommandDefinition ? (
    | (T extends PartialCommandDefinitionForSlash ? GuildSlashCommandContext<T, M> | DmSlashCommandContext<T, M> : never)
    | (T extends PartialCommandDefinitionForMessage ? GuildMessageCommandContext<M> | DmMessageCommandContext<M> : never)
    | (T extends PartialCommandDefinitionForUser ? GuildUserCommandContext<M> | DmUserCommandContext<M> : never)
    ) : T extends SubCommandDefinition ?
    GuildSlashCommandContext<T, M> | DmSlashCommandContext<T, M> : never;