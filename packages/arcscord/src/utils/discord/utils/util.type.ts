import type { NewsChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel } from "discord.js";

/**
 * Represents a union type for text-based channels in a guild, prioritizing text communication.
 */
export type GuildTextFirstBasedChannel =
  | NewsChannel
  | TextChannel
  | PrivateThreadChannel
  | PublicThreadChannel;
