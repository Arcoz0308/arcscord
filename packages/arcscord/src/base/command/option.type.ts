import type { commandOptionTypesEnum } from "#/base/command/command.enum";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { Attachment, GuildBasedChannel, Role, User } from "discord.js";

/**
 * Specifies the type for command options.
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
 */
export type CommandOptionType = keyof typeof commandOptionTypesEnum;

/**
 * Base command options structure.
 * @see [discord docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
 */
export type BaseSlashOption = {
  /** Localization for the name of the option */
  nameLocalizations?: LocaleMap;
  /** Description of the option */
  description: string;
  /** Localization for the description of the option */
  descriptionLocalizations?: LocaleMap;
  /**
   * If the option is required.
   * @default false
   */
  required?: boolean;
  /**
   * Type of the command option
   * @see [Discord Docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
   */
  type: CommandOptionType;
};

/**
 * Structure for choice strings.
 */
export type ChoiceString = {
  /** Name of the choice */
  name: string;
  /** Localization for the name of the choice */
  nameLocalizations?: LocaleMap;
  /** Value of the choice */
  value: string;
};

/**
 * Defines the structure for string choices.
 */
export type StringChoices = (ChoiceString | string)[] | { [key: string]: string };

/**
 * Structure for string choice options.
 */
export type ChoiceOptionString = {
  /**
   * List of choices
   *
   * @example
   * ```ts
   * choices: {
   *   name: "value"
   * };
   * // or
   * choices: ["value1", "value2"];
   * // or
   * choices: [
   *   {
   *     name: "This one",
   *     nameLocalizations: {en: "This"},
   *     value: "first"
   *   }.
   *   "second",
   * ]
   * ```
   */
  choices?: StringChoices;
  /** only false allowed if the ares  choices */
  autocomplete?: false;
};

/**
 * Structure for choice numbers.
 */
export type ChoiceNumber = {
  /** Name of the choice */
  name: string;
  /** Localization for the name of the choice */
  nameLocalizations?: LocaleMap;
  /** Value of the choice */
  value: number;
};

/**
 * Defines the structure for number choices.
 */
export type NumberChoices = (ChoiceNumber | number)[] | { [key: string]: number };

/**
 * Structure for number choice options.
 */
export type ChoiceOptionNumber = {
  /**
   * List of choices
   *
   * @example
   * ```ts
   * choices: {
   *   name: 1
   * };
   * // or
   * choices: [1, 2];
   * // or
   * choices: [
   *   {
   *     name: "This one",
   *     nameLocalizations: {en: "This"},
   *     value: 1
   *   }.
   *   2,
   * ]
   * ```
   */
  choices?: NumberChoices;
  /** only false allowed if the ares  choices */
  autocomplete?: false;
};

/**
 * Structure for autocomplete options.
 */
export type Autocomplete = {
  /** Whether autocomplete is enabled */
  autocomplete?: true;
};

/**
 * Structure for base string options.
 */
export type BaseStringOption = BaseSlashOption & {
  /** Type of the command option */
  type: "string";
  /** Minimum length of the string */
  min_length?: number;
  /** Maximum length of the string */
  max_length?: number;
};

/**
 * Structure for base integer options.
 */
export type BaseIntegerOption = BaseSlashOption & {
  /** Type of the command option */
  type: "integer";
  /** Minimum value of the integer */
  min_value?: number;
  /** Maximum value of the integer */
  max_value?: number;
};

/**
 * Structure for boolean options.
 */
export type BooleanOption = BaseSlashOption & {
  /** Type of the command option */
  type: "boolean";
};

/**
 * Structure for user options.
 */
export type UserOption = BaseSlashOption & {
  /** Type of the command option */
  type: "user";
};

/**
 * Structure for channel options.
 */
export type ChannelOption = BaseSlashOption & {
  /** Type of the command option */
  type: "channel";
  /** List of allowed channel types */
  channel_types?: Exclude<ChannelType, "dm" | "groupDm">[];
};

/**
 * Structure for role options.
 */
export type RoleOption = BaseSlashOption & {
  /** Type of the command option */
  type: "role";
};

/**
 * Structure for mentionable options.
 */
export type MentionableOption = BaseSlashOption & {
  /** Type of the command option */
  type: "mentionable";
};

/**
 * Structure for base number options.
 */
export type BaseNumberOption = BaseSlashOption & {
  /** Type of the command option */
  type: "number";
  /** Minimum value of the number */
  min_value?: number;
  /** Maximum value of the number */
  max_value?: number;
};

/**
 * Structure for attachment options.
 */
export type AttachmentOption = BaseSlashOption & {
  /** Type of the command option */
  type: "attachment";
};

/**
 * Defines the option type for command options.
 */
export type Option = BaseSlashOption &
  (
    | (BaseStringOption & (ChoiceOptionString | Autocomplete))
    | (BaseIntegerOption & (ChoiceOptionNumber | Autocomplete))
    | BooleanOption
    | UserOption
    | ChannelOption
    | RoleOption
    | MentionableOption
    | (BaseNumberOption & (ChoiceOptionNumber | Autocomplete))
    | AttachmentOption
    );

/**
 * Defines the list of command options.
 */
export type OptionsList = { [key: string]: Option };

/**
 * @internal
 */
type StringChoiceValue<T extends StringChoices> =
  T extends Array<infer U>
    ? U extends string
      ? U
      : U extends ChoiceString
        ? U["value"]
        : never
    : T[keyof T];

/**
 * @internal
 */
type StringChoice<T extends ChoiceOptionString> =
  T["choices"] extends StringChoices ? StringChoiceValue<T["choices"]> : never;

/**
 * @internal
 */
type NumberChoiceValue<T extends NumberChoices> =
  T extends Array<infer U>
    ? U extends number
      ? U
      : U extends ChoiceNumber
        ? U["value"]
        : never
    : T[keyof T];

/**
 * @internal
 */
type NumberChoice<T extends ChoiceOptionNumber> =
  T["choices"] extends NumberChoices ? NumberChoiceValue<T["choices"]> : never;

/**
 * @internal
 */
export type ContextOption<T extends Option> = T extends BaseStringOption
  ? T extends ChoiceOptionString
    ? StringChoice<T>
    : string
  : T extends BaseIntegerOption
    ? T extends ChoiceOptionNumber
      ? NumberChoice<T>
      : number
    : T extends BooleanOption
      ? boolean
      : T extends UserOption
        ? User
        : T extends ChannelOption
          ? GuildBasedChannel
          : T extends RoleOption
            ? Role
            : T extends MentionableOption
              ? User | Role
              : T extends BaseNumberOption
                ? T extends ChoiceOptionNumber
                  ? NumberChoice<T>
                  : number
                : T extends AttachmentOption
                  ? Attachment
                  : never;

/**
 * @internal
 */
export type OptionalContextOption<T extends Option> = T extends {
  required: true;
}
  ? ContextOption<T>
  : ContextOption<T> | undefined;

/**
 * @internal
 */
export type ContextOptions<T extends OptionsList> = {
  [K in keyof T]: OptionalContextOption<T[K]>;
};
