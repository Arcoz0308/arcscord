import type { Result } from "#/utils/error/error.type";
import type {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder
} from "@discordjs/builders";
import type { SelectMenuError } from "#/utils/error/class/select_menu_error";
import type { AnySelectMenuInteraction } from "discord.js";

export type AnySelectMenuBuilder = ChannelSelectMenuBuilder|MentionableSelectMenuBuilder|RoleSelectMenuBuilder|
  StringSelectMenuBuilder|UserSelectMenuBuilder;

export type SelectMenuRunResult = Result<string|true, SelectMenuError>

export type SelectMenuRunContext = {
  interaction: AnySelectMenuInteraction;
  defer: boolean;
}