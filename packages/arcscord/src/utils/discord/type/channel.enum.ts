/**
 * Enum for different types of discord channels.
 * @see [Discord Docs](https://discord.com/developers/docs/resources/channel#channel-object-channel-types)
 * @enum {number}
 */
export const channelTypeEnum = {
  guildText: 0,
  dm: 1,
  guildVoice: 2,
  groupDm: 3,
  guildCategory: 4,
  guildAnnouncement: 5,
  announcementThread: 10,
  publicThread: 11,
  privateThread: 12,
  guildStageVoice: 13,
  guildDirectory: 14,
  guildForum: 15,
  guildMedia: 16,
};
