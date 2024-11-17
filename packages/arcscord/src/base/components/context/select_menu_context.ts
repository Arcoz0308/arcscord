import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { StringSelectMenuValues, TypedSelectMenuOptions } from "#/base/components";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type { GuildComponentContextOptions } from "#/base/components/context/base_context";
import type {
  APIChannel,
  APIRole,
  Channel,
  ChannelSelectMenuInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  Role,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  User,
  UserSelectMenuInteraction,
} from "discord.js";
import { MessageComponentContext } from "#/base/components/context/message_component_context";

/**
 * Guild context for select menu interactions.
 */
export class GuildSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends MessageComponentContext<M> {
  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  /**
   * Creates an instance of GuildSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The MessageComponentInteraction instance.
   * @param options - Options containing guild, channel, and member info.
   */
  constructor(
    client: ArcClient,
    interaction: MessageComponentInteraction,
    options: GuildComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }

  isSelectMenuContext(): this is DmSelectMenuContext | GuildSelectMenuContext {
    return true;
  }
}

/**
 * DM context for select menu interactions.
 */
export class DmSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends MessageComponentContext<M> {
  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;

  isSelectMenuContext(): this is DmSelectMenuContext | GuildSelectMenuContext {
    return true;
  }
}

/**
 * Options for the StringSelectMenuContext.
 */
export type StringSelectMenuContextOptions<
  T extends TypedSelectMenuOptions | undefined = undefined,
> = {
  values: T extends TypedSelectMenuOptions
    ? StringSelectMenuValues<T>
    : string[];
};

/**
 * Guild context for string select menu interactions.
 */
export class GuildStringSelectMenuContext<
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> extends GuildSelectMenuContext<M> {
  /**
   * Selected Values (typed soon)
   */
  values: T extends TypedSelectMenuOptions
    ? StringSelectMenuValues<T>
    : string[];

  interaction: StringSelectMenuInteraction;

  /**
   * Creates an instance of GuildStringSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The StringSelectMenuInteraction instance.
   * @param options - Options containing guild context and select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: StringSelectMenuInteraction,
    options: GuildComponentContextOptions<M> & StringSelectMenuContextOptions<T>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isStringSelectMenuContext(): this is StringSelectMenuContext {
    return true;
  }
}

/**
 * DM context for string select menu interactions.
 */
export class DmStringSelectMenuContext<
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> extends DmSelectMenuContext<M> {
  /**
   * Selected Values (typed soon)
   */
  values: T extends TypedSelectMenuOptions
    ? StringSelectMenuValues<T>
    : string[];

  interaction: StringSelectMenuInteraction;

  /**
   * Creates an instance of DmStringSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The StringSelectMenuInteraction instance.
   * @param options - Options containing select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: StringSelectMenuInteraction,
    options: StringSelectMenuContextOptions<T> & BaseComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isStringSelectMenuContext(): this is StringSelectMenuContext {
    return true;
  }
}

/**
 * Type for StringSelectMenuContext.
 */
export type StringSelectMenuContext<
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> = GuildStringSelectMenuContext<M, T> | DmStringSelectMenuContext<M, T>;

/**
 * Options for the UserSelectMenuContext.
 */
export type UserSelectMenuContextOptions = {
  values: User[];
};

/**
 * Guild context for user select menu interactions.
 */
export class GuildUserSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends GuildSelectMenuContext<M> {
  /**
   * Selected users
   */
  values: User[];

  interaction: UserSelectMenuInteraction;

  /**
   * Creates an instance of GuildUserSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The UserSelectMenuInteraction instance.
   * @param options - Options containing guild context and select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: UserSelectMenuInteraction,
    options: GuildComponentContextOptions<M> & UserSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isUserSelectMenuContext(): this is UserSelectMenuContext {
    return true;
  }
}

/**
 * DM context for user select menu interactions.
 */
export class DmUserSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends DmSelectMenuContext<M> {
  /**
   * Selected users
   */
  values: User[];

  interaction: UserSelectMenuInteraction;

  /**
   * Creates an instance of DmUserSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The UserSelectMenuInteraction instance.
   * @param options - Options containing select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: UserSelectMenuInteraction,
    options: UserSelectMenuContextOptions & BaseComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isUserSelectMenuContext(): this is UserSelectMenuContext {
    return true;
  }
}

/**
 * Type for UserSelectMenuContext.
 */
export type UserSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> =
  | GuildUserSelectMenuContext<M>
  | DmUserSelectMenuContext<M>;

/**
 * Options for the RoleSelectMenuContext.
 */
export type RoleSelectMenuContextOptions = {
  values: (Role | APIRole)[];
};

/**
 * Guild context for role select menu interactions.
 */
export class GuildRoleSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends GuildSelectMenuContext<M> {
  /**
   * Selected roles
   */
  values: (Role | APIRole)[];

  interaction: RoleSelectMenuInteraction;

  /**
   * Creates an instance of GuildRoleSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The RoleSelectMenuInteraction instance.
   * @param options - Options containing guild context and select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: RoleSelectMenuInteraction,
    options: GuildComponentContextOptions<M> & RoleSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isRoleSelectMenuContext(): this is RoleSelectMenuContext {
    return true;
  }
}

/**
 * DM context for role select menu interactions.
 */
export class DmRoleSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends DmSelectMenuContext<M> {
  /**
   * Selected roles
   */
  values: (Role | APIRole)[];

  interaction: RoleSelectMenuInteraction;

  /**
   * Creates an instance of DmRoleSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The RoleSelectMenuInteraction instance.
   * @param options - Options containing select menu values.
   */
  constructor(
    client: ArcClient,
    interaction: RoleSelectMenuInteraction,
    options: RoleSelectMenuContextOptions & BaseComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isRoleSelectMenuContext(): this is RoleSelectMenuContext {
    return true;
  }
}

/**
 * Type for RoleSelectMenuContext.
 */
export type RoleSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> =
  | GuildRoleSelectMenuContext<M>
  | DmRoleSelectMenuContext<M>;

/**
 * Options for the MentionableSelectMenuContext.
 */
export type MentionableSelectMenuContextOptions = {
  roles: (Role | APIRole)[];
  users: User[];
};

/**
 * Guild context for mentionable select menu interactions.
 */
export class GuildMentionableSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends GuildSelectMenuContext<M> {
  /**
   * All selected Users and/or Role
   */
  values: (Role | User | APIRole)[];

  /**
   * Selected Roles
   */
  roles: (Role | APIRole)[];

  /**
   * Selected users
   */
  users: User[];

  interaction: MentionableSelectMenuInteraction;

  /**
   * Creates an instance of GuildMentionableSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The MentionableSelectMenuInteraction instance.
   * @param options - Options containing guild context, roles, and users.
   */
  constructor(
    client: ArcClient,
    interaction: MentionableSelectMenuInteraction,
    options: GuildComponentContextOptions<M> & MentionableSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }

  isMentionableSelectMenuContext(): this is MentionableSelectMenuContext {
    return true;
  }
}

/**
 * DM context for mentionable select menu interactions.
 */
export class DmMentionableSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends DmSelectMenuContext<M> {
  /**
   * All selected Users and/or Role
   */
  values: (Role | User | APIRole)[];

  /**
   * Selected Roles
   */
  roles: (Role | APIRole)[];

  /**
   * Selected users
   */
  users: User[];

  interaction: MentionableSelectMenuInteraction;

  /**
   * Creates an instance of DmMentionableSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The MentionableSelectMenuInteraction instance.
   * @param options - Options containing roles and users.
   */
  constructor(
    client: ArcClient,
    interaction: MentionableSelectMenuInteraction,
    options: MentionableSelectMenuContextOptions & BaseComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }

  isMentionableSelectMenuContext(): this is MentionableSelectMenuContext {
    return true;
  }
}

/**
 * Type for MentionableSelectMenuContext.
 */
export type MentionableSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> =
  | GuildMentionableSelectMenuContext<M>
  | DmMentionableSelectMenuContext<M>;

/**
 * Options for the ChannelSelectMenuContext.
 */
export type ChannelSelectMenuContextOptions = {
  values: (Channel | APIChannel)[];
};

/**
 * Guild context for channel select menu interactions.
 */
export class GuildChannelSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends GuildSelectMenuContext<M> {
  /**
   * Selected channels
   */
  values: (Channel | APIChannel)[];

  interaction: ChannelSelectMenuInteraction;

  /**
   * Creates an instance of GuildChannelSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The ChannelSelectMenuInteraction instance.
   * @param options - Options containing guild context and channel values.
   */
  constructor(
    client: ArcClient,
    interaction: ChannelSelectMenuInteraction,
    options: GuildComponentContextOptions<M> & ChannelSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isChannelSelectMenuContext(): this is ChannelSelectMenuContext {
    return true;
  }
}

/**
 * DM context for channel select menu interactions.
 */
export class DmChannelSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends DmSelectMenuContext<M> {
  /**
   * Selected channels
   */
  values: (Channel | APIChannel)[];

  interaction: ChannelSelectMenuInteraction;

  /**
   * Creates an instance of DmChannelSelectMenuContext.
   * @param client - The ArcClient instance.
   * @param interaction - The ChannelSelectMenuInteraction instance.
   * @param options - Options containing channel values.
   */
  constructor(
    client: ArcClient,
    interaction: ChannelSelectMenuInteraction,
    options: ChannelSelectMenuContextOptions & BaseComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

  isChannelSelectMenuContext(): this is ChannelSelectMenuContext {
    return true;
  }
}

/**
 * Type for ChannelSelectMenuContext.
 */
export type ChannelSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> =
  | GuildChannelSelectMenuContext<M>
  | DmChannelSelectMenuContext<M>;
