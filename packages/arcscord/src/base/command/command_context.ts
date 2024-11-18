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
  MessageCommandContextDocs,
} from "#/base/utils";
import type { CommandErrorOptions } from "#/utils";
import type {
  ChatInputCommandInteraction,
  CommandInteraction,
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
import type { APIInteractionGuildMember } from "discord-api-types/v10";
import type i18next from "i18next";
import { CommandError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";
import { InteractionContextType } from "discord.js";
import { InteractionContext } from "../utils/interaction_context.class";

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
  locale: string;
};

/**
 * Base class for creating a command context
 */
export class BaseCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
  InGuild extends true | false = true | false,
> extends InteractionContext<InGuild> implements ContextDocs {
  /**
   * The command properties
   */
  command: CommandHandler;

  /**
   * The original Discord.js interaction
   */
  interaction: CommandInteraction;

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

  /**
   * get a locale text, with language detected self
   */
  t: typeof i18next.t;

  /**
   * Construct a new BaseCommandContext
   */
  constructor(
    command: CommandHandler,
    interaction: CommandInteraction,
    options: BaseCommandContextBuilderOptions<M>,
  ) {
    super(options.client, interaction);

    this.command = command;
    this.interaction = interaction;

    this.interactionContext = this.#interactionContextConverter(
      interaction.context,
    );
    this.interactionSource = interaction.authorizingIntegrationOwners["0"]
      ? "guildInstall"
      : "userInstall";

    this.client = options.client;

    this.resolvedCommandName = options.resolvedName;
    this.additional = options.additional || ({} as MiddlewaresResults<M>);

    if (this.client.localeManager.enabled) {
      this.t = this.client.localeManager.i18n.getFixedT(options.locale);
    }
    else {
      this.t = this.client.localeManager.t;
    }
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

  inGuild(): this is BaseCommandContext<CommandMiddleware[], true> {
    return this.interaction.inGuild();
  }
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
export type SlashCommandContextBuilderOptions<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = | PartialCommandDefinitionForSlash
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  options: ContextOptionsDef<T>;
};

/**
 * Class for creating a guild slash command context
 */
export class SlashCommandContext<
  T extends PartialCommandDefinitionForSlash | SubCommandDefinition = | PartialCommandDefinitionForSlash
  | SubCommandDefinition,
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> {
  options: ContextOptionsDef<T>;

  readonly type = "slash" as const;

  readonly isSlashCommand = true;

  readonly isMessageCommand = false;

  readonly isUserCommand = false;

  interaction: ChatInputCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: ChatInputCommandInteraction,
    options: SlashCommandContextBuilderOptions<T, M>,
  ) {
    super(command, interaction, options);

    this.options = options.options;

    this.interaction = interaction;
  }
}

/**
 * Options for building a guild message command context
 */
export type MessageCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  message: Message;
};

/**
 * Class for creating a guild message command context
 */
export class MessageCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> implements CommandContextDocs, MessageCommandContextDocs {
  targetMessage: Message;

  readonly type = "message" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = true;

  readonly isUserCommand = false;

  interaction: MessageContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: MessageContextMenuCommandInteraction,
    options: MessageCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetMessage = options.message;

    this.interaction = interaction;
  }
}

/**
 * Options for building a guild user command context
 */
export type UserCommandContextBuilderOptions<
  M extends CommandMiddleware[] = CommandMiddleware[],
> = BaseCommandContextBuilderOptions<M> & {
  targetUser: User;
  targetMember: GuildMember | APIInteractionGuildMember | null;
};

/**
 * Class for creating a guild user command context
 */
export class UserCommandContext<
  M extends CommandMiddleware[] = CommandMiddleware[],
> extends BaseCommandContext<M> implements CommandContextDocs {
  /**
   * The user that the command target
   */
  targetUser: User;

  /**
   * The member that the command target, if null maybe user left the guild or command run in dm
   */
  targetMember: GuildMember | APIInteractionGuildMember | null;

  readonly type = "user" as const;

  readonly isSlashCommand = false;

  readonly isMessageCommand = false;

  readonly isUserCommand = true;

  interaction: UserContextMenuCommandInteraction;

  constructor(
    command: CommandHandler,
    interaction: UserContextMenuCommandInteraction,
    options: UserCommandContextBuilderOptions<M>,
  ) {
    super(command, interaction, options);

    this.targetUser = options.targetUser;
    this.targetMember = options.targetMember;

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
    ? SlashCommandContext<T, M>
    : never)
  | (T extends PartialCommandDefinitionForMessage
    ? MessageCommandContext<M>
    : never)
  | (T extends PartialCommandDefinitionForUser
    ? UserCommandContext<M>
    : never)
  : T extends SubCommandDefinition
    ? SlashCommandContext<T, M>
    : never;
