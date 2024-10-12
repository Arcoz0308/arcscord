import type { channelTypeEnum } from "#/utils/discord/type/channel.enum";

/**
 * Different types of discord channels.
 * @see [Discord Docs](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
 */
export type ChannelType = keyof typeof channelTypeEnum;
