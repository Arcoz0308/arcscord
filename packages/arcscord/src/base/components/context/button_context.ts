import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type { GuildComponentContextOptions } from "#/base/components/context/base_context";
import type { DmContextDocs, GuildContextDocs } from "#/base/utils";
import type { ButtonInteraction, Guild, GuildBasedChannel, GuildMember } from "discord.js";
import { MessageComponentContext } from "#/base/components/context/message_component_context";

/**
 * BaseButtonContext class.
 * Extends MessageComponentContext and provides context for button interactions.
 */
export class BaseButtonContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends MessageComponentContext<M> {
  interaction: ButtonInteraction;

  /**
   * Creates an instance of BaseButtonContext.
   * @param client - The ArcClient instance.
   * @param interaction - The ButtonInteraction instance.
   * @param options
   */
  constructor(client: ArcClient, interaction: ButtonInteraction, options: BaseComponentContextOptions<M>) {
    super(client, interaction, options);

    this.interaction = interaction;
  }

  isButtonContext(): this is ButtonContext {
    return true;
  }
}

/**
 * GuildButtonContext class.
 * Extends BaseButtonContext and provides context for button interactions within a guild.
 */
export class GuildButtonContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends BaseButtonContext<M> implements GuildContextDocs {
  guildId: string;
  guild: Guild;
  channelId: string;
  channel: GuildBasedChannel;
  member: GuildMember;
  readonly inGuild = true;
  readonly inDM = false;

  /**
   * Creates an instance of GuildButtonContext.
   * @param client - The ArcClient instance.
   * @param interaction - The ButtonInteraction instance.
   * @param options - The GuildComponentContextOptions instance.
   */
  constructor(
    client: ArcClient,
    interaction: ButtonInteraction,
    options: GuildComponentContextOptions<M>,
  ) {
    super(client, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }
}

/**
 * DmButtonContext class.
 * Extends BaseButtonContext and provides context for button interactions within a direct message.
 */
export class DmButtonContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends BaseButtonContext<M> implements DmContextDocs {
  guildId = null;
  guild = null;
  channelId = null;
  channel = null;
  member = null;
  readonly inGuild = false;
  readonly inDM = true;
}

/**
 * ButtonContext type.
 * Represents either a GuildButtonContext or a DmButtonContext instance.
 */
export type ButtonContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> = GuildButtonContext<M> | DmButtonContext<M>;
