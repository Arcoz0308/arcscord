import type { GuildTextFirstBasedChannel } from "#/utils/discord/utils/util.type";
import type { GuildBasedChannel } from "discord.js";
import { ChannelType } from "discord-api-types/v10";

/**
 * Checks if the provided channel is a Guild Text-based Channel.
 *
 * @param channel - The channel to be checked, which is based on the guild.
 * @return True if the channel is a guild text-based channel, otherwise false.
 */
export function isGuildTextChannel(
  channel: GuildBasedChannel,
): channel is GuildTextFirstBasedChannel {
  return (
    channel.isTextBased()
    && (channel.type as ChannelType) !== ChannelType.GuildCategory
    && !channel.isVoiceBased()
  );
}
