import type { BaseInteraction, Guild, GuildMember, GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import type { APIInteractionGuildMember } from "discord-api-types/v10";

export class InteractionContext<InGuild extends true | false = true | false> {
  /**
   * The guild of the context
   */
  guild: InGuild extends true ? Guild : null;

  /**
   * The id of the guild of the context
   */
  guildId: InGuild extends true ? string : null;

  /**
   * The member of the context
   */
  member: InGuild extends true ? GuildMember | APIInteractionGuildMember : null;

  /**
   * The channel of the context
   */
  channel: InGuild extends true ? GuildTextBasedChannel | TextBasedChannel : null;

  /**
   * The id of the channel of the context
   */
  channelId: InGuild extends true ? string : null;

  constructor(interaction: BaseInteraction) {
    this.guild = interaction.guild as InGuild extends true ? Guild : null;
    this.guildId = interaction.guildId as InGuild extends true ? string : null;
    this.member = interaction.member as InGuild extends true ? GuildMember | APIInteractionGuildMember : null;
    this.channel = interaction.channel as InGuild extends true ? GuildTextBasedChannel | TextBasedChannel : null;
    this.channelId = interaction.channelId as InGuild extends true ? string : null;
  }
}
