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
import type { ButtonStyle, ComponentType } from "discord-api-types/v10";

/**
 * Type for Discord component types by name
 * [Discord Docs](https://discord.com/developers/docs/interactions/message-components#component-object-component-types).
 */
export type StringComponentType = keyof typeof componentTypesEnum;

/**
 * Type for Discord button styles by name.
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles)
 */
export type StringButtonStyle = keyof typeof buttonStyleEnum;

/**
 * Type for renamed button styles by color.
 */
export type StringButtonColor = keyof typeof buttonColorEnum;

/**
 * Base type for a UI component.
 */
export type BaseComponent = {
  readonly type: Exclude<ComponentType, ComponentType.ActionRow>;
};

/**
 * Base type for a button component.
 */
export type BaseButton = BaseComponent & {
  readonly type: ComponentType.Button;
  readonly label?: string;
  readonly emoji?: ComponentEmojiResolvable;
  readonly disabled?: boolean;
};

/**
 * Type for a clickable button.
 */
export type ClickableButton = BaseButton & {
  readonly style: Exclude<StringButtonStyle, "link"> | StringButtonColor | Exclude<ButtonStyle, ButtonStyle.Link>;
  readonly customId: string;
};

/**
 * Type for a link button.
 */
export type LinkButton = BaseButton & {
  readonly style: Extract<StringButtonStyle, "link"> | ButtonStyle.Link;
  readonly url: string;
};

/**
 * Union type for all button variants.
 */
export type Button = LinkButton | ClickableButton;

/**
 * Base type for a select menu component.
 */
export type BaseSelectMenu = BaseComponent & {
  readonly type: Exclude<ComponentType, ComponentType.Button | ComponentType.ActionRow | ComponentType.TextInput>;
  readonly customId: string;
  readonly minValues?: number;
  readonly maxValues?: number;
  readonly placeholder?: string;
  readonly disabled?: boolean;
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
  readonly id: string;
  readonly type: AllowedType;
};

/**
 * Type for select menu options.
 */
export type SelectOptions = {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly emoji?: ComponentEmojiResolvable;
  readonly default?: boolean;
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
  readonly type: ComponentType.StringSelect;
  readonly options: SelectOptions[] | string[] | TypedSelectMenuOptions;
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
  readonly type: ComponentType.UserSelect;
  readonly defaultValues?: SelectMenuDefaultValue<"user">[];
};

/**
 * Type for a role select menu.
 */
export type RoleSelectMenu = BaseSelectMenu & {
  readonly type: ComponentType.RoleSelect;
  readonly defaultValues?: SelectMenuDefaultValue<"role">[];
};

/**
 * Type for a mentionable select menu.
 */
export type MentionableSelectMenu = BaseSelectMenu & {
  readonly type: ComponentType.MentionableSelect;
  readonly defaultValues?: SelectMenuDefaultValue<"user" | "role">[];
};

/**
 * Type for a channel select menu.
 */
export type ChannelSelectMenu = BaseSelectMenu & {
  readonly type: ComponentType.ChannelSelect;
  readonly defaultValues?: SelectMenuDefaultValue<"channel">[];
  readonly channelTypes?: ChannelType[];
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
  readonly type: ComponentType.TextInput;
  readonly customId: string;
  readonly style: TextInputStyle;
  readonly label: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly required?: boolean;
  readonly value?: string;
  readonly placeholder?: string;
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
