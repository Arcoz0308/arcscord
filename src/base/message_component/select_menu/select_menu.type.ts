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

type BaseSelectMenuClass = {
  selectType: SelectMenuType;
}

export type ChannelSelectMenuClass = BaseSelectMenuClass & {
  builder: ChannelSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<ChannelSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
  selectType: "channel";
}

export type MentionableSelectMenuClass = BaseSelectMenuClass & {
  builder: MentionableSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<MentionableSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
  selectType: "mentionable";
}

export type RoleSelectMenuClass = BaseSelectMenuClass & {
  builder: RoleSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<RoleSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
  selectType: "role";
}

export type StringSelectMenuClass = BaseSelectMenuClass & {
  builder: StringSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<StringSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
  selectType: "string";
}

export type UserSelectMenuClass = BaseSelectMenuClass & {
  builder: UserSelectMenuBuilder;
  run: (ctx: SelectMenuRunContext<UserSelectMenuInteraction>) => Promise<SelectMenuRunResult>;
  selectType: "user";
}

export type AnySelectMenuClass = ChannelSelectMenuClass|MentionableSelectMenuClass|RoleSelectMenuClass|
  StringSelectMenuClass|UserSelectMenuClass;