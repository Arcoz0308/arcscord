import type { PermissionFlagsBits } from "discord-api-types/v10";
import type { NewsChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel } from "discord.js";

export type StringPermissions = keyof typeof PermissionFlagsBits

export type GuildTextFirstBasedChannel =  NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel;