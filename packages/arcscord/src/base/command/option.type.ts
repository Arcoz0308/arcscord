import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { commandOptionTypesEnum } from "#/base/command/command.enum";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import type { Attachment, GuildBasedChannel, Role, User } from "discord.js";

export type CommandOptionType = keyof typeof commandOptionTypesEnum

export type BaseSlashOption = {
  nameLocalizations?: LocaleMap;
  description: string;
  descriptionLocalizations?: LocaleMap;
  required?: boolean;
  type: CommandOptionType;
}

export type ChoiceString = {
  name: string;
  nameLocalizations?: LocaleMap;
  value: string;
}

export type StringChoices = (ChoiceString | string)[] | { [key: string]: string };

export type ChoiceOptionString = {
  choices?: StringChoices;
  autocomplete?: false;
}

export type ChoiceNumber = {
  name: string;
  nameLocalizations?: LocaleMap;
  value: number;
}

export type NumberChoices = (ChoiceNumber | number)[] | { [key: string]: number };

export type ChoiceOptionNumber = {
  choices?: NumberChoices;
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
  (| (BaseStringOption & (ChoiceOptionString | Autocomplete | NonNullable<unknown>))
    | (BaseIntegerOption & (ChoiceOptionNumber | Autocomplete | NonNullable<unknown>))
    | BooleanOption
    | UserOption
    | ChannelOption
    | RoleOption
    | MentionableOption
    | (BaseNumberOption & (ChoiceOptionNumber | Autocomplete | NonNullable<unknown>))
    | AttachmentOption);

export type OptionsList = Record<string, Option>

type StringChoiceValue<T extends StringChoices> =
  (T extends Array<infer U> ? U extends string ? U : (U extends ChoiceString ? U["value"] : never) : T[keyof T]);

type StringChoice<T extends ChoiceOptionString> = T["choices"] extends StringChoices ? StringChoiceValue<T["choices"]> : never;

type NumberChoiceValue<T extends NumberChoices> =
  (T extends Array<infer U> ? U extends number ? U : (U extends ChoiceNumber ? U["value"] : never) : T[keyof T]);

type NumberChoice<T extends ChoiceOptionNumber> = T["choices"] extends NumberChoices ? NumberChoiceValue<T["choices"]> : never;

export type ContextOption<T extends Option> = T extends BaseStringOption ? (T extends ChoiceOptionString ? StringChoice<T> : string)
  : T extends BaseIntegerOption ? (T extends ChoiceOptionNumber ? NumberChoice<T> : number)
    : T extends BooleanOption ? boolean
      : T extends UserOption ? User
        : T extends ChannelOption ? GuildBasedChannel
          : T extends RoleOption ? Role
            : T extends MentionableOption ? User | Role
              : T extends BaseNumberOption ? (T extends ChoiceOptionNumber ? NumberChoice<T> : number)
                : T extends AttachmentOption ? Attachment : never;


export type OptionalContextOption<T extends Option> = T extends { required: true }
  ? ContextOption<T> : ContextOption<T> | undefined;

export type ContextOptions<T extends OptionsList> = {
  [Prob in keyof T]: OptionalContextOption<T[Prob]>
};