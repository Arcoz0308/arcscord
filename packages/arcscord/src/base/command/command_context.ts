import type { ArcClient, CommandHandler, CommandRunResult } from "#/base";
import type {
  CommandContexts,
  CommandIntegrationType,
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SubCommandDefinition,
} from "#/base/command/command_definition.type";
import type { CommandMiddleware } from "#/base/command/command_middleware";
import type { ContextOptions, OptionsList } from "#/base/command/option.type";
import type {
  CommandContextDocs,
  ContextDocs,
  DmContextDocs,
  GuildContextDocs,
  MessageCommandContextDocs,
  SlashCommandContextDocs,
  UserCommandContextDocs,
} from "#/base/utils";
import type { CommandErrorOptions } from "#/utils";
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
  UserContextMenuCommandInteraction,
} from "discord.js";
import type i18next from "i18next";
import { CommandError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";
import { InteractionContextType } from "discord.js";

/**
 * @internal
 */
type MiddlewaresResults<M extends CommandMiddleware[]> = {
  [K in M[number] as K["name"]]: NonNullable<
    Awaited<ReturnType<K["run"]>>["next"]
  >;
};

/**
 * Options for building a base command context
 */
export type BaseCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = {
  resolvedName: string;
  additional?: MiddlewaresResults<M>;
  client: ArcClient;
};

/**
 * Base class for creating a command context
 */
export class BaseCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> implements ContextDocs {
  /**
   * The command properties
   */
  command: CommandHandler;

  /**
   * The original Discord.js interaction
   */
  interaction: CommandInteraction;

  user: User;

  /**
   * The context of the interaction
   * @see [Discord Docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
   */
  interactionContext: CommandContexts | null;

  /**
   * The source of the integration that triggered the interaction
   * @see [Discord Docs](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
   */
  interactionSource: CommandIntegrationType;

  /**
   * Whether the reply to the interaction is deferred
   */
  defer: boolean = false;

  client: ArcClient;

  /**
   * The resolved name of the command
   */
  resolvedCommandName: string;

  /**
   * Additional middleware results
   *
   * @remarks is an object with each name of used middleware and results of him
   */
  additional: MiddlewaresResults<M>;

  t: typeof i18next.t;

  /**
   * Construct a new BaseCommandContext
   */
  constructor(
    command: CommandHandler,
    interaction: CommandInteraction,
    options: BaseCommandContextBuilderOptions<M>,
  ) {
    this.command = command;
    this.interaction = interaction;

    this.user = interaction.user;

    this.interactionContext = this.#interactionContextConverter(
      interaction.context,
    );
    this.interactionSource = interaction.authorizingIntegrationOwners["0"]
      ? "guildInstall"
      : "userInstall";

    this.client = options.client;

    this.resolvedCommandName = options.resolvedName;
    this.additional = options.additional || ({} as MiddlewaresResults<M>);

    this.t = this.client.localeManager.i18n.getFixedT("en");
    void this.loadTranslate();
  }

  /**
   * @internal
   * @private
   */
  private async loadTranslate(): Promise<void> {
    this.t = this.client.localeManager.i18n.getFixedT(
      await this.client.localeManager.detectLanguage({
        interaction: this.interaction,
        user: this.user,
        guild: this.interaction.guild,
        channel: this.interaction.channel,
      }),
    );
  }
  /**
   * Reply to the interaction with a message
   */
  async reply(
    message: string,
    options?: Omit<InteractionReplyOptions, "content">
  ): Promise<CommandRunResult>;

  /**
   * Reply to the interaction with options
   */
  async reply(
    options: MessagePayload | InteractionReplyOptions
  ): Promise<CommandRunResult>;

  async reply(
    message: string | MessagePayload | InteractionReplyOptions,
    options?: Omit<InteractionReplyOptions, "content">,
  ): Promise<CommandRunResult> {
    try {
      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.reply(message);
      return ok(true);
    }
    catch (e) {
      return error(
        new CommandError({
          ctx: this,
          message: `failed to reply to interaction : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Edit the reply to the interaction with a message
   */
  async editReply(
    message: string,
    options?: Omit<InteractionEditReplyOptions, "content">
  ): Promise<CommandRunResult>;

  /**
   * Edit the reply to the interaction with options
   */
  async editReply(
    options: MessagePayload | InteractionEditReplyOptions
  ): Promise<CommandRunResult>;

  async editReply(
    message: string | MessagePayload | InteractionEditReplyOptions,
    options?: Omit<InteractionReplyOptions, "content">,
  ): Promise<CommandRunResult> {
    try {
      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.editReply(message);
      return ok(true);
    }
    catch (e) {
      return error(
        new CommandError({
          ctx: this,
          message: `failed to edit reply to interaction : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Defer the reply to the interaction
   */
  async deferReply(
    options: InteractionDeferReplyOptions,
  ): Promise<CommandRunResult> {
    try {
      await this.interaction.deferReply(options);
      this.defer = true;
      return ok(true);
    }
    catch (e) {
      return error(
        new CommandError({
          ctx: this,
          message: `failed to defer reply to interaction : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * send a modal to user that created interaction
   */
  async showModal(modal: ModalComponentData): Promise<CommandRunResult> {
    try {
      await this.interaction.showModal(modal);
      return ok(true);
    }
    catch (e) {
      return error(
        new CommandError({
          ctx: this,
          message: `failed to show modal : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Create a success result
   */
  ok(value: string | true = true): CommandRunResult {
    return ok(value);
  }

  /**
   * Create an error result
   */
  error(options: Omit<CommandErrorOptions, "ctx">): CommandRunResult {
    return error(new CommandError({ ...options, ctx: this }));
  }

  /**
   * Execute multiple functions sequentially, stopping if any function returns an error
   */
  async multiple(
    ...funcList: Promise<CommandRunResult>[]
  ): Promise<CommandRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }

  /**
   * @internal
   */
  #interactionContextConverter(
    ctx: InteractionContextType | null,
  ): CommandContexts | null {
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

/**
 * Options for building a guild command context
 */
export type GuildCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  guild: Guild;
  channel: GuildBasedChannel;
  member: GuildMember;
};

/**
 * Class for creating a guild command context
 */
export class GuildCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> implements GuildContextDocs {
  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(
    command: CommandHandler,
    interaction: CommandInteraction,
    options: GuildCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }
}

/**
 * Class for creating a DM command context
 */
export class DmCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> implements DmContextDocs {
  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;
}

/**
 * @internal
 */
type ContextOptionsDef<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition,
> = T extends PartialCommandDefinitionForSlash
  ? T["slash"]["options"] extends OptionsList
    ? ContextOptions<T["slash"]["options"]>
    : null
  : T extends SubCommandDefinition
    ? T["options"] extends OptionsList
      ? ContextOptions<T["options"]>
      : null
    : never;

/**
 * Options for building a guild slash command context
 */
export type GuildSlashCommandContextBuilderOptions<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = | PartialCommandDefinitionForSlash
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> = GuildCommandContextBuilderOptions<M> & {
  options: ContextOptionsDef<T>;
};

/**
 * Class for creating a guild slash command context
 */
export class GuildSlashCommandContext<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = | PartialCommandDefinitionForSlash
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> implements CommandContextDocs, SlashCommandContextDocs {
  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: ChatInputCommandInteraction,
    options: GuildSlashCommandContextBuilderOptions<T, M>,
  ) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }
}

/**
 * Options for building a guild message command context
 */
export type GuildMessageCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = GuildCommandContextBuilderOptions<M> & {
  message: Message;
};

/**
 * Class for creating a guild message command context
 */
export class GuildMessageCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> implements CommandContextDocs, MessageCommandContextDocs {
  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: MessageContextMenuCommandInteraction,
    options: GuildMessageCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }
}

/**
 * Options for building a guild user command context
 */
export type GuildUserCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = GuildCommandContextBuilderOptions<M> & {
  targetUser: User;
  targetMember: GuildMember | null;
};

/**
 * Class for creating a guild user command context
 */
export class GuildUserCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends GuildCommandContext<M> implements CommandContextDocs, UserCommandContextDocs {
  targetUser: User;

  targetMember: GuildMember | null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: UserContextMenuCommandInteraction,
    options: GuildUserCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;
    this.targetMember = options.targetMember;

    this.interaction = interaction;
  }
}

/**
 * Options for building a DM slash command context
 */
export type DmSlashCommandContextBuilderOptions<
  T extends | (PartialCommandDefinitionForSlash & FullCommandDefinition)
  | SubCommandDefinition = | PartialCommandDefinitionForSlash
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  options: ContextOptionsDef<T>;
};

/**
 * Class for creating a DM slash command context
 */
export class DmSlashCommandContext<
  T extends | (PartialCommandDefinitionForSlash & FullCommandDefinition)
  | SubCommandDefinition = | (PartialCommandDefinitionForSlash & FullCommandDefinition)
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> implements CommandContextDocs, SlashCommandContextDocs {
  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: ChatInputCommandInteraction,
    options: DmSlashCommandContextBuilderOptions<T, M>,
  ) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }
}

/**
 * Options for building a DM message command context
 */
export type DmMessageCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  message: Message;
};

/**
 * Class for creating a DM message command context
 */
export class DmMessageCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> implements CommandContextDocs, MessageCommandContextDocs {
  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: MessageContextMenuCommandInteraction,
    options: DmMessageCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }
}

/**
 * Options for building a DM user command context
 */
export type DmUserCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  targetUser: User;
};

/**
 * Class for creating a DM user command context
 */
export class DmUserCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends DmCommandContext<M> implements CommandContextDocs, UserCommandContextDocs {
  targetUser: User;

  targetMember = null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: UserContextMenuCommandInteraction,
    options: DmUserCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;

    this.interaction = interaction;
  }
}

/**
 * A command context
 */
export type CommandContext<
  T extends FullCommandDefinition | SubCommandDefinition = | FullCommandDefinition
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> = T extends FullCommandDefinition
  ?
  | (T extends PartialCommandDefinitionForSlash
    ? GuildSlashCommandContext<T, M> | DmSlashCommandContext<T, M>
    : never)
    | (T extends PartialCommandDefinitionForMessage
      ? GuildMessageCommandContext<M> | DmMessageCommandContext<M>
      : never)
      | (T extends PartialCommandDefinitionForUser
        ? GuildUserCommandContext<M> | DmUserCommandContext<M>
        : never)
  : T extends SubCommandDefinition
    ? GuildSlashCommandContext<T, M> | DmSlashCommandContext<T, M>
    : never;
