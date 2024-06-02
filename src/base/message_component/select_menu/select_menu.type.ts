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
import type { selectMenuTypes } from "#/base/message_component/select_menu/select_menu.enum";

export type AnySelectMenuBuilder = ChannelSelectMenuBuilder|MentionableSelectMenuBuilder|RoleSelectMenuBuilder|
  StringSelectMenuBuilder|UserSelectMenuBuilder;

export type SelectMenuRunResult = Result<string|true, SelectMenuError>

export type SelectMenuRunContext = {
  interaction: AnySelectMenuInteraction;
  defer: boolean;
}

export type SelectMenuType = keyof typeof selectMenuTypes;