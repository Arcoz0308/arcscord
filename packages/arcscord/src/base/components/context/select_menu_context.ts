import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { StringSelectMenuValues, TypedSelectMenuOptions } from "#/base/components";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type {
  APIChannel,
  APIRole,
  Channel,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  Role,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  User,
  UserSelectMenuInteraction,
} from "discord.js";
import { MessageComponentContext } from "#/base/components/context/message_component_context";

/**
 * Base context for select menu interactions.
 */
export class SelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends MessageComponentContext<M> {
  isSelectMenuContext(): this is SelectMenuContext {
    return true;
  }
}

/**
 * Options for the StringSelectMenuContext.
 */
export type StringSelectMenuContextOptions<
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> = BaseComponentContextOptions<M> & {
  values: T extends TypedSelectMenuOptions
    ? StringSelectMenuValues<T>
    : string[];
};

/**
 * Context for string select menu interactions.
 */
export class StringSelectMenuContext<
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> extends SelectMenuContext<M> {
  values: T extends TypedSelectMenuOptions
    ? StringSelectMenuValues<T>
    : string[];

  interaction: StringSelectMenuInteraction;

  constructor(
    client: ArcClient,
    interaction: StringSelectMenuInteraction,
    options: StringSelectMenuContextOptions<M, T>,
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
 * Options for the UserSelectMenuContext.
 */
export type UserSelectMenuContextOptions<M extends ComponentMiddleware[] = ComponentMiddleware[]> = BaseComponentContextOptions<M> & {
  values: User[];
};

/**
 * Context for user select menu interactions.
 */
export class UserSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends SelectMenuContext<M> {
  values: User[];
  interaction: UserSelectMenuInteraction;

  constructor(
    client: ArcClient,
    interaction: UserSelectMenuInteraction,
    options: UserSelectMenuContextOptions,
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
 * Options for the RoleSelectMenuContext.
 */
export type RoleSelectMenuContextOptions<M extends ComponentMiddleware[] = ComponentMiddleware[]> = BaseComponentContextOptions<M> & {
  values: (Role | APIRole)[];
};

/**
 * Context for role select menu interactions.
 */
export class RoleSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends SelectMenuContext<M> {
  values: (Role | APIRole)[];
  interaction: RoleSelectMenuInteraction;

  constructor(
    client: ArcClient,
    interaction: RoleSelectMenuInteraction,
    options: RoleSelectMenuContextOptions,
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
 * Options for the MentionableSelectMenuContext.
 */
export type MentionableSelectMenuContextOptions<M extends ComponentMiddleware[] = ComponentMiddleware[]> = BaseComponentContextOptions<M> & {
  roles: (Role | APIRole)[];
  users: User[];
};

/**
 * Context for mentionable select menu interactions.
 */
export class MentionableSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends SelectMenuContext<M> {
  values: (Role | User | APIRole)[];
  roles: (Role | APIRole)[];
  users: User[];
  interaction: MentionableSelectMenuInteraction;

  constructor(
    client: ArcClient,
    interaction: MentionableSelectMenuInteraction,
    options: MentionableSelectMenuContextOptions,
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
 * Options for the ChannelSelectMenuContext.
 */
export type ChannelSelectMenuContextOptions<M extends ComponentMiddleware[] = ComponentMiddleware[]> = BaseComponentContextOptions<M> & {
  values: (Channel | APIChannel)[];
};

/**
 * Context for channel select menu interactions.
 */
export class ChannelSelectMenuContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends SelectMenuContext<M> {
  values: (Channel | APIChannel)[];
  interaction: ChannelSelectMenuInteraction;

  constructor(
    client: ArcClient,
    interaction: ChannelSelectMenuInteraction,
    options: ChannelSelectMenuContextOptions,
  ) {
    super(client, interaction, options);
    this.values = options.values;
    this.interaction = interaction;
  }

  isChannelSelectMenuContext(): this is ChannelSelectMenuContext {
    return true;
  }
}
