import type { NewsChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel } from "discord.js";

export type GuildTextFirstBasedChannel =  NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel;