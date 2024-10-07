import type { ArcClient } from "#/base";
import type { GuildComponentContextOptions } from "#/base/components/context/base_context";
import type {
  ButtonInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember,
} from "discord.js";
import { MessageComponentContext } from "#/base/components/context/message_component_context";

export class BaseButtonContext extends MessageComponentContext {
  interaction: ButtonInteraction;

  constructor(client: ArcClient, interaction: ButtonInteraction) {
    super(client, interaction);

    this.interaction = interaction;
  }
}

export class GuildButtonContext extends BaseButtonContext {
  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(
    client: ArcClient,
    interaction: ButtonInteraction,
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

export class DmButtonContext extends BaseButtonContext {
  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;
}

export type ButtonContext = GuildButtonContext | DmButtonContext;
