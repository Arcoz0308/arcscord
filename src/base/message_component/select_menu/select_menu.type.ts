import type { Result } from "#/utils/error/error.type";
import type {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder
} from "@discordjs/builders";
import type { SelectMenuError } from "#/utils/error/class/select_menu_error.class";
import type {
  AnySelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction
} from "discord.js";
import type { selectMenuTypes } from "#/base/message_component/select_menu/select_menu.enum";

export type AnySelectMenuBuilder = ChannelSelectMenuBuilder|MentionableSelectMenuBuilder|RoleSelectMenuBuilder|
  StringSelectMenuBuilder|UserSelectMenuBuilder;

export type SelectMenuRunResult = Result<string|true, SelectMenuError>

export type SelectMenuRunContext<T extends AnySelectMenuInteraction = AnySelectMenuInteraction> = {
  interaction: T;
  defer: boolean;
}

export type SelectMenuType = keyof typeof selectMenuTypes;

export type ChannelSelectMenuClass = {
  builder: ChannelSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<ChannelSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
}

export type MentionableSelectMenuClass = {
  builder: MentionableSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<MentionableSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
}

export type RoleSelectMenuClass = {
  builder: RoleSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<RoleSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
}

export type StringSelectMenuClass = {
  builder: StringSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<StringSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
}

export type UserSelectMenuClass = {
  builder: UserSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<UserSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
}

export type AnySelectMenuClass = ChannelSelectMenuClass|MentionableSelectMenuClass|RoleSelectMenuClass|
  StringSelectMenuClass|UserSelectMenuClass;