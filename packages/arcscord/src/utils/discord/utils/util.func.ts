import type { GuildTextFirstBasedChannel } from "#/utils/discord/utils/util.type";
import type { GuildBasedChannel } from "discord.js";
import { ChannelType } from "discord-api-types/v10";

export function isGuildTextChannel(
  channel: GuildBasedChannel,
): channel is GuildTextFirstBasedChannel {
  return (
    channel.isTextBased()
    && (channel.type as ChannelType) !== ChannelType.GuildCategory
    && !channel.isVoiceBased()
  );
}
