import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { commandOptionTypesEnum } from "#/base/command/command.enum";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import type { Attachment, Channel, Role, User } from "discord.js";

export type CommandOptionType = keyof typeof commandOptionTypesEnum

export type BaseSlashOption = {
  nameLocalizations?: LocaleMap;
  description: string;
  descriptionLocalizations?: LocaleMap;
  required?: boolean;
  type: CommandOptionType;
}

export type Choice<T extends string | number> = {
  name: string;
  nameLocalizations?: LocaleMap;
  value: T;
}

export type ChoiceOption<T extends string | number> = {
  choices?: Choice<T>[];
  autocomplete?: false;
}

export type Autocomplete = {
  autocomplete?: true;
}

export type BaseStringOption = BaseSlashOption & {
  type: "string";
  min_length?: number;
  max_length?: number;
}

export type BaseIntegerOption = BaseSlashOption & {
  type: "integer";
  min_value?: number;
  max_value?: number;
}

export type BooleanOption = BaseSlashOption & {
  type: "boolean";
}

export type UserOption = BaseSlashOption & {
  type: "user";
}

export type ChannelOption = BaseSlashOption & {
  type: "channel";
  channel_types?: Exclude<ChannelType, "dm" | "groupDm">[];
}

export type RoleOption = BaseSlashOption & {
  type: "role";
}

export type MentionableOption = BaseSlashOption & {
  type: "mentionable";
}

export type BaseNumberOption = BaseSlashOption & {
  type: "number";
  min_value?: number;
  max_value?: number;
}

export type AttachmentOption = BaseSlashOption & {
  type: "attachment";
}

export type Option = BaseSlashOption &
  (| (BaseStringOption & (ChoiceOption<string> | Autocomplete | NonNullable<unknown>))
    | (BaseIntegerOption & (ChoiceOption<number> | Autocomplete | NonNullable<unknown>))
    | BooleanOption
    | UserOption
    | ChannelOption
    | RoleOption
    | MentionableOption
    | (BaseNumberOption & (ChoiceOption<number> | Autocomplete | NonNullable<unknown>))
    | AttachmentOption);

export type OptionsList = Record<string, Option>

export type ContextOption<T extends Option> = T extends BaseStringOption ? string
  : T extends BaseIntegerOption ? number
    : T extends BooleanOption ? boolean
      : T extends UserOption ? User
        : T extends ChannelOption ? Channel
          : T extends RoleOption ? Role
            : T extends MentionableOption ? User | Role
              : T extends BaseNumberOption ? number
                : T extends AttachmentOption ? Attachment : never;


export type OptionalContextOption<T extends Option> = T extends { required: true }
  ? ContextOption<T> : ContextOption<T> | undefined;

export type ContextOptions<T extends OptionsList> = {
  [Prob in keyof T]: OptionalContextOption<T[Prob]>
}