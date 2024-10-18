import type { BitFieldResolvable, ClientEvents, GatewayIntentsString } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";
// Based of https://discord.com/developers/docs/topics/gateway#list-of-intents

export const intentsMap = {
  guildCreate: GatewayIntentBits.Guilds,
  guildUpdate: GatewayIntentBits.Guilds,
  guildDelete: GatewayIntentBits.Guilds,
  roleCreate: GatewayIntentBits.Guilds,
  roleUpdate: GatewayIntentBits.Guilds,
  roleDelete: GatewayIntentBits.Guilds,
  channelCreate: GatewayIntentBits.Guilds,
  channelUpdate: GatewayIntentBits.Guilds,
  channelDelete: GatewayIntentBits.Guilds,
  channelPinsUpdate: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  threadCreate: GatewayIntentBits.Guilds,
  threadUpdate: GatewayIntentBits.Guilds,
  threadDelete: GatewayIntentBits.Guilds,
  threadListSync: GatewayIntentBits.Guilds,
  threadMemberUpdate: GatewayIntentBits.Guilds,
  threadMembersUpdate: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  stageInstanceCreate: GatewayIntentBits.Guilds,
  stageInstanceUpdate: GatewayIntentBits.Guilds,
  stageInstanceDelete: GatewayIntentBits.Guilds,

  guildMemberAdd: GatewayIntentBits.GuildMembers,
  guildMemberUpdate: GatewayIntentBits.GuildMembers,
  guildMemberRemove: GatewayIntentBits.GuildMembers,

  guildAuditLogEntryCreate: GatewayIntentBits.GuildModeration,
  guildBanAdd: GatewayIntentBits.GuildModeration,
  guildBanRemove: GatewayIntentBits.GuildModeration,

  emojiCreate: GatewayIntentBits.GuildEmojisAndStickers,
  emojiUpdate: GatewayIntentBits.GuildEmojisAndStickers,
  emojiDelete: GatewayIntentBits.GuildEmojisAndStickers,
  stickerCreate: GatewayIntentBits.GuildEmojisAndStickers,
  stickerUpdate: GatewayIntentBits.GuildEmojisAndStickers,
  stickerDelete: GatewayIntentBits.GuildEmojisAndStickers,

  guildIntegrationsUpdate: GatewayIntentBits.GuildIntegrations,
  interactionCreate: GatewayIntentBits.GuildIntegrations,

  webhooksUpdate: GatewayIntentBits.GuildWebhooks,
  webhookUpdate: GatewayIntentBits.GuildWebhooks,

  inviteCreate: GatewayIntentBits.GuildInvites,
  inviteDelete: GatewayIntentBits.GuildInvites,

  voiceStateUpdate: GatewayIntentBits.GuildVoiceStates,

  presenceUpdate: GatewayIntentBits.GuildPresences,

  messageCreate: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  messageUpdate: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  messageDelete: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  messageDeleteBulk: GatewayIntentBits.GuildMessages,

  messageReactionAdd: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
  messageReactionRemove: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
  messageReactionRemoveAll: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],
  messageReactionRemoveEmoji: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions],

  typingStart: [GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessageTyping],

  guildScheduledEventCreate: GatewayIntentBits.GuildScheduledEvents,
  guildScheduledEventUpdate: GatewayIntentBits.GuildScheduledEvents,
  guildScheduledEventDelete: GatewayIntentBits.GuildScheduledEvents,
  guildScheduledEventUserAdd: GatewayIntentBits.GuildScheduledEvents,
  guildScheduledEventUserRemove: GatewayIntentBits.GuildScheduledEvents,

  autoModerationRuleCreate: GatewayIntentBits.AutoModerationConfiguration,
  autoModerationRuleUpdate: GatewayIntentBits.AutoModerationConfiguration,
  autoModerationRuleDelete: GatewayIntentBits.AutoModerationConfiguration,

  autoModerationActionExecution: GatewayIntentBits.AutoModerationExecution,

  messagePollVoteAdd: [GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.DirectMessagePolls],
  messagePollVoteRemove: [GatewayIntentBits.GuildMessagePolls, GatewayIntentBits.DirectMessagePolls],

  // none
  ready: 0,
  error: 0,
  debug: 0,
  warn: 0,
  applicationCommandPermissionsUpdate: 0,
  cacheSweep: 0,
  entitlementCreate: 0,
  entitlementUpdate: 0,
  entitlementDelete: 0,
  guildAvailable: 0,
  guildUnavailable: 0,
  guildMemberAvailable: 0,
  guildMembersChunk: 0,
  invalidated: 0,
  userUpdate: 0,
  shardDisconnect: 0,
  shardError: 0,
  shardReady: 0,
  shardReconnecting: 0,
  shardResume: 0,

} satisfies Record<keyof ClientEvents, BitFieldResolvable<GatewayIntentsString, number>>;
