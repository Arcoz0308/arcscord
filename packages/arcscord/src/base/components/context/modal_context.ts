import type { ArcClient } from "#/base";
import type {
  Guild,
  GuildBasedChannel,
  GuildMember,
  ModalSubmitInteraction,
} from "discord.js";
import {
  ComponentContext,
  type GuildComponentContextOptions,
} from "#/base/components/context/base_context";

export class DmModalContext extends ComponentContext {
  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;

  interaction: ModalSubmitInteraction;

  values: Map<string, string>;

  constructor(client: ArcClient, interaction: ModalSubmitInteraction) {
    super(client, interaction);

    this.interaction = interaction;

    this.values = new Map<string, string>(
      interaction.fields.fields.map(field => [field.customId, field.value]),
    );
  }
}

export class GuildModalContext extends ComponentContext {
  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  interaction: ModalSubmitInteraction;

  values: Map<string, string>;

  constructor(
    client: ArcClient,
    interaction: ModalSubmitInteraction,
    options: GuildComponentContextOptions,
  ) {
    super(client, interaction);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;

    this.interaction = interaction;

    this.values = new Map<string, string>(
      interaction.fields.fields.map(field => [field.customId, field.value]),
    );
  }
}

export type ModalContext = DmModalContext | GuildModalContext;
