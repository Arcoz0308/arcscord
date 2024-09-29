import { MessageComponentContext } from "#/base/components/context/message_component_context";
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
  UserSelectMenuInteraction
} from "discord.js";
import type { ArcClient } from "#/base";
import type { GuildComponentContextOptions } from "#/base/components/context/base_context";
import type { StringSelectMenuValues, TypedSelectMenuOptions } from "#/base/components";

/* Guild */

export class GuildSelectMenuContext extends MessageComponentContext {

  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(client: ArcClient, interaction: MessageComponentInteraction, options: GuildComponentContextOptions) {
    super(client, interaction);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }

}


/* DM */

export class DmSelectMenuContext extends MessageComponentContext {

  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;

}


/* String Select */

export type StringSelectMenuContextOptions<
  T extends TypedSelectMenuOptions | undefined = undefined
> = {
  values: T extends TypedSelectMenuOptions ? StringSelectMenuValues<T> : string[];
}

export class GuildStringSelectMenuContext<
  T extends TypedSelectMenuOptions | undefined
> extends GuildSelectMenuContext {

  values: T extends TypedSelectMenuOptions ? StringSelectMenuValues<T> : string[];

  interaction: StringSelectMenuInteraction;

  constructor(client: ArcClient, interaction: StringSelectMenuInteraction, options:
    (GuildComponentContextOptions & StringSelectMenuContextOptions<T>)) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export class DmStringSelectMenuContext<
  T extends TypedSelectMenuOptions | undefined
> extends DmSelectMenuContext {

  values: T extends TypedSelectMenuOptions ? StringSelectMenuValues<T> : string[];

  interaction: StringSelectMenuInteraction;

  constructor(client: ArcClient, interaction: StringSelectMenuInteraction, options: StringSelectMenuContextOptions<T>) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export type StringSelectMenuContext<
  T extends TypedSelectMenuOptions | undefined = undefined
> = GuildStringSelectMenuContext<T> | DmStringSelectMenuContext<T>;


/* User Select */

export type UserSelectMenuContextOptions = {
  values: User[];
}

export class GuildUserSelectMenuContext extends GuildSelectMenuContext {

  values: User[];

  interaction: UserSelectMenuInteraction;

  constructor(client: ArcClient, interaction: UserSelectMenuInteraction, options: GuildComponentContextOptions & UserSelectMenuContextOptions) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export class DmUserSelectMenuContext extends DmSelectMenuContext {

  values: User[];

  interaction: UserSelectMenuInteraction;

  constructor(client: ArcClient, interaction: UserSelectMenuInteraction, options: UserSelectMenuContextOptions) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export type UserSelectMenuContext = GuildUserSelectMenuContext | DmUserSelectMenuContext;


/* Role Select*/

export type RoleSelectMenuContextOptions = {
  values: (Role | APIRole)[];
}

export class GuildRoleSelectMenuContext extends GuildSelectMenuContext {

  values: (Role | APIRole)[];

  interaction: RoleSelectMenuInteraction;

  constructor(client: ArcClient, interaction: RoleSelectMenuInteraction, options: GuildComponentContextOptions & RoleSelectMenuContextOptions) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export class DmRoleSelectMenuContext extends DmSelectMenuContext {

  values: (Role | APIRole)[];

  interaction: RoleSelectMenuInteraction;

  constructor(client: ArcClient, interaction: RoleSelectMenuInteraction, options: RoleSelectMenuContextOptions) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export type RoleSelectMenuContext = GuildRoleSelectMenuContext | DmRoleSelectMenuContext;


/* Mentionable Select */

export type MentionableSelectMenuContextOptions = {
  roles: (Role | APIRole)[];
  users: User[];
}

export class GuildMentionableSelectMenuContext extends GuildSelectMenuContext {

  values: (Role | User | APIRole)[];

  roles: (Role | APIRole)[];

  users: User[];

  interaction: MentionableSelectMenuInteraction;

  constructor(client: ArcClient, interaction: MentionableSelectMenuInteraction, options:
    (GuildComponentContextOptions & MentionableSelectMenuContextOptions)) {
    super(client, interaction, options);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }

}

export class DmMentionableSelectMenuContext extends DmSelectMenuContext {

  values: (Role | User | APIRole)[];

  roles: (Role | APIRole)[];

  users: User[];

  interaction: MentionableSelectMenuInteraction;

  constructor(client: ArcClient, interaction: MentionableSelectMenuInteraction, options: MentionableSelectMenuContextOptions) {
    super(client, interaction);

    this.interaction = interaction;
    this.roles = options.roles;
    this.users = options.users;
    this.values = [...options.roles, ...options.users];
  }

}

export type MentionableSelectMenuContext = GuildMentionableSelectMenuContext | DmMentionableSelectMenuContext;


/* Channel Select */

export type ChannelSelectMenuContextOptions = {
  values: (Channel | APIChannel)[];
}

export class GuildChannelSelectMenuContext extends GuildSelectMenuContext {

  values: (Channel | APIChannel)[];

  interaction: ChannelSelectMenuInteraction;

  constructor(client: ArcClient, interaction: ChannelSelectMenuInteraction, options: GuildComponentContextOptions & ChannelSelectMenuContextOptions) {
    super(client, interaction, options);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export class DmChannelSelectMenuContext extends DmSelectMenuContext {

  values: (Channel | APIChannel)[];

  interaction: ChannelSelectMenuInteraction;

  constructor(client: ArcClient, interaction: ChannelSelectMenuInteraction, options: ChannelSelectMenuContextOptions) {
    super(client, interaction);

    this.values = options.values;
    this.interaction = interaction;
  }

}

export type ChannelSelectMenuContext = GuildChannelSelectMenuContext | DmChannelSelectMenuContext;