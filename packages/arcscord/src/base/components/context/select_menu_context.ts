import type { ArcClient } from "#/base";
import type { StringSelectMenuValues, TypedSelectMenuOptions } from "#/base/components";
import type { GuildComponentContextOptions } from "#/base/components/context/base_context";
import type { DmContextDocs, GuildContextDocs } from "#/base/utils";
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
export class GuildSelectMenuContext extends MessageComponentContext implements GuildContextDocs {
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
    options: GuildComponentContextOptions,
  ) {
    super(client, interaction);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }
}

/**
 * DM context for select menu interactions.
 */
export class DmSelectMenuContext extends MessageComponentContext implements DmContextDocs {
  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;
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
  T extends TypedSelectMenuOptions | undefined,
> extends GuildSelectMenuContext {
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
    options: GuildComponentContextOptions & StringSelectMenuContextOptions<T>,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * DM context for string select menu interactions.
 */
export class DmStringSelectMenuContext<
  T extends TypedSelectMenuOptions | undefined,
> extends DmSelectMenuContext {
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
    options: StringSelectMenuContextOptions<T>,
  ) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * Type for StringSelectMenuContext.
 */
export type StringSelectMenuContext<
  T extends TypedSelectMenuOptions | undefined = undefined,
> = GuildStringSelectMenuContext<T> | DmStringSelectMenuContext<T>;

/**
 * Options for the UserSelectMenuContext.
 */
export type UserSelectMenuContextOptions = {
  values: User[];
};

/**
 * Guild context for user select menu interactions.
 */
export class GuildUserSelectMenuContext extends GuildSelectMenuContext {
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
    options: GuildComponentContextOptions & UserSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * DM context for user select menu interactions.
 */
export class DmUserSelectMenuContext extends DmSelectMenuContext {
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
    options: UserSelectMenuContextOptions,
  ) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * Type for UserSelectMenuContext.
 */
export type UserSelectMenuContext =
  | GuildUserSelectMenuContext
  | DmUserSelectMenuContext;

/**
 * Options for the RoleSelectMenuContext.
 */
export type RoleSelectMenuContextOptions = {
  values: (Role | APIRole)[];
};

/**
 * Guild context for role select menu interactions.
 */
export class GuildRoleSelectMenuContext extends GuildSelectMenuContext {
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
    options: GuildComponentContextOptions & RoleSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * DM context for role select menu interactions.
 */
export class DmRoleSelectMenuContext extends DmSelectMenuContext {
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
    options: RoleSelectMenuContextOptions,
  ) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * Type for RoleSelectMenuContext.
 */
export type RoleSelectMenuContext =
  | GuildRoleSelectMenuContext
  | DmRoleSelectMenuContext;

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
export class GuildMentionableSelectMenuContext extends GuildSelectMenuContext {
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
    options: GuildComponentContextOptions & MentionableSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }
}

/**
 * DM context for mentionable select menu interactions.
 */
export class DmMentionableSelectMenuContext extends DmSelectMenuContext {
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
    options: MentionableSelectMenuContextOptions,
  ) {
    super(client, interaction);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }
}

/**
 * Type for MentionableSelectMenuContext.
 */
export type MentionableSelectMenuContext =
  | GuildMentionableSelectMenuContext
  | DmMentionableSelectMenuContext;

/**
 * Options for the ChannelSelectMenuContext.
 */
export type ChannelSelectMenuContextOptions = {
  values: (Channel | APIChannel)[];
};

/**
 * Guild context for channel select menu interactions.
 */
export class GuildChannelSelectMenuContext extends GuildSelectMenuContext {
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
    options: GuildComponentContextOptions & ChannelSelectMenuContextOptions,
  ) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * DM context for channel select menu interactions.
 */
export class DmChannelSelectMenuContext extends DmSelectMenuContext {
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
    options: ChannelSelectMenuContextOptions,
  ) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }
}

/**
 * Type for ChannelSelectMenuContext.
 */
export type ChannelSelectMenuContext =
  | GuildChannelSelectMenuContext
  | DmChannelSelectMenuContext;
