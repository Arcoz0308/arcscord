import type {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder
} from "@discordjs/builders";

export type AnySelectMenuBuilder = ChannelSelectMenuBuilder|MentionableSelectMenuBuilder|RoleSelectMenuBuilder|
  StringSelectMenuBuilder|UserSelectMenuBuilder;