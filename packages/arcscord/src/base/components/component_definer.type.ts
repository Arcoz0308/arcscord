import type {
  buttonColorEnum,
  buttonStyleEnum,
  componentTypesEnum,
  textInputStyleEnum,
} from "#/base/components/component.enum";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import type {
  ChannelSelectMenuComponentData,
  ComponentEmojiResolvable,
  MentionableSelectMenuComponentData,
  RoleSelectMenuComponentData,
  StringSelectMenuComponentData,
  UserSelectMenuComponentData,
} from "discord.js";

/**
 * Type for Discord component types by name
 * [Discord Docs](https://discord.com/developers/docs/interactions/message-components#component-object-component-types).
 */
export type ComponentType = keyof typeof componentTypesEnum;

/**
 * Type for Discord button styles by name.
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles)
 */
export type ButtonStyle = keyof typeof buttonStyleEnum;

/**
 * Type for renamed button styles by color.
 */
export type ButtonColor = keyof typeof buttonColorEnum;

/**
 * Base type for a UI component.
 */
export type BaseComponent = {
  type: ComponentType;
};

/**
 * Base type for a button component.
 */
export type BaseButton = BaseComponent & {
  type: Extract<ComponentType, "button">;
  label?: string;
  emoji?: ComponentEmojiResolvable;
  disabled?: boolean;
};

/**
 * Type for a clickable button.
 */
export type ClickableButton = BaseButton & {
  style: Exclude<ButtonStyle, "link"> | ButtonColor;
  customId: string;
};

/**
 * Type for a link button.
 */
export type LinkButton = BaseButton & {
  style: Extract<ButtonStyle, "link">;
  url: string;
};

/**
 * Union type for all button variants.
 */
export type Button = LinkButton | ClickableButton;

/**
 * Base type for a select menu component.
 */
export type BaseSelectMenu = BaseComponent & {
  type: Exclude<ComponentType, "button" | "actionRow" | "textInput">;
  customId: string;
  minValues?: number;
  maxValues?: number;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Type for the possible select menu default value types.
 */
export type SelectMenuDefaultValueType = "user" | "role" | "channel";

/**
 * Type for select menu default values.
 * @template AllowedType The allowed types for the default value.
 */
export type SelectMenuDefaultValue<
  AllowedType extends SelectMenuDefaultValueType,
> = {
  id: string;
  type: AllowedType;
};

/**
 * Type for select menu options.
 */
export type SelectOptions = {
  label: string;
  value: string;
  description?: string;
  emoji?: ComponentEmojiResolvable;
  default?: boolean;
};

/**
 * Type for typed select menu options.
 */
export type TypedSelectMenuOptions = Record<
  string,
  Omit<SelectOptions, "value"> | string
>;

/**
 * Type for a string select menu.
 */
export type StringSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "stringSelect">;
  options: SelectOptions[] | string[] | TypedSelectMenuOptions;
};

/**
 * @internal
 */
export type StringSelectMenuValues<T extends TypedSelectMenuOptions> =
  (keyof T)[];

/**
 * Type for a user select menu.
 */
export type UserSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "userSelect">;
  defaultValues?: SelectMenuDefaultValue<"user">[];
};

/**
 * Type for a role select menu.
 */
export type RoleSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "roleSelect">;
  defaultValues?: SelectMenuDefaultValue<"role">[];
};

/**
 * Type for a mentionable select menu.
 */
export type MentionableSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "mentionableSelect">;
  defaultValues?: SelectMenuDefaultValue<"user" | "role">[];
};

/**
 * Type for a channel select menu.
 */
export type ChannelSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "channelSelect">;
  defaultValues?: SelectMenuDefaultValue<"channel">[];
  channelTypes?: ChannelType[];
};

/**
 * Union type for all select menu variants.
 */
export type SelectMenu =
  | UserSelectMenu
  | RoleSelectMenu
  | MentionableSelectMenu
  | ChannelSelectMenu
  | StringSelectMenu;

/**
 * Union type for all select menu component data types.
 */
export type AnySelectMenuComponentData =
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData
  | RoleSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | ChannelSelectMenuComponentData;

/**
 * Type for Discord text input styles by name.
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#text-input-object-text-input-styles)
 */
export type TextInputStyle = keyof typeof textInputStyleEnum;

/**
 * Type for a text input component.
 */
export type TextInput = BaseComponent & {
  type: Extract<ComponentType, "textInput">;
  customId: string;
  style: TextInputStyle;
  label: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
};

/**
 * Type for typed text input components.
 */
export type TypedTextInput = {
  readonly [Key: string]: Omit<TextInput, "customId" | "type">;
};

/**
 * @internal
 */
export type ModalValues<T extends TypedTextInput> = {
  readonly [K in keyof T]: T[K]["required"] extends true
    ? string
    : string | undefined;
};
