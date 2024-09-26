import type {
  buttonColorEnum,
  buttonStyleEnum,
  componentTypesEnum,
  textInputStyleEnum
} from "#/base/components/component.enum";
import type {
  ChannelSelectMenuComponentData,
  ComponentEmojiResolvable,
  MentionableSelectMenuComponentData,
  RoleSelectMenuComponentData,
  StringSelectMenuComponentData,
  UserSelectMenuComponentData
} from "discord.js";
import type { ChannelType } from "#/utils/discord/type/channel.type";

export type ComponentType = keyof typeof componentTypesEnum;

export type ButtonStyle = keyof typeof buttonStyleEnum;
export type ButtonColor = keyof typeof buttonColorEnum;

export type BaseComponent = {
  type: ComponentType;
}

export type ActionRow = BaseComponent & {
  type: Extract<ComponentType, "actionRow">;
  components: Button[];
}


export type BaseButton = BaseComponent & {
  type: Extract<ComponentType, "button">;
  label?: string;
  emoji?: ComponentEmojiResolvable;
  disabled?: boolean;
}

export type ClickableButton = BaseButton & {
  style: Exclude<ButtonStyle, "link"> | ButtonColor;
  customId: string;
}

export type LinkButton = BaseButton & {
  style: Extract<ButtonStyle, "link">;
  url: string;
}

export type Button = LinkButton | ClickableButton;

export type BaseSelectMenu = BaseComponent & {
  type: Exclude<ComponentType, "button" | "actionRow" | "textInput">;
  customId: string;
  minValues?: number;
  maxValues?: number;
  placeholder?: string;
  disabled?: boolean;
}

export type SelectMenuDefaultValueType = "user" | "role" | "channel";

export type SelectMenuDefaultValue<AllowedType extends SelectMenuDefaultValueType> = {
  id: string;
  type: AllowedType;
}

export type SelectOptions = {
  label: string;
  value: string;
  description?: string;
  emoji?: ComponentEmojiResolvable;
  default?: boolean;
}

export type TypedSelectMenuOptions = Record<string, Omit<SelectOptions, "value"> | string>

export type StringSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "stringSelect">;
  options: SelectOptions[] | string[] | TypedSelectMenuOptions;
}

export type StringSelectMenuValues<T extends TypedSelectMenuOptions> = (keyof T)[];

export type UserSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "userSelect">;
  defaultValues?: SelectMenuDefaultValue<"user">[];
}

export type RoleSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "roleSelect">;
  defaultValues?: SelectMenuDefaultValue<"role">[];
}

export type MentionableSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "mentionableSelect">;
  defaultValues?: SelectMenuDefaultValue<"user" | "role">[];
}

export type ChannelSelectMenu = BaseSelectMenu & {
  type: Extract<ComponentType, "channelSelect">;
  defaultValues?: SelectMenuDefaultValue<"channel">[];
  channelTypes?: ChannelType[];
}

export type SelectMenu = UserSelectMenu | RoleSelectMenu | MentionableSelectMenu | ChannelSelectMenu | StringSelectMenu;

export type AnySelectMenuComponentData =
  | StringSelectMenuComponentData
  | UserSelectMenuComponentData
  | RoleSelectMenuComponentData
  | MentionableSelectMenuComponentData
  | ChannelSelectMenuComponentData;

export type TextInputStyle = keyof typeof textInputStyleEnum;

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
}

export type TypedTextInput = {
  readonly [Key: string]: Omit<TextInput, "customId" | "type">;
}

export type ModalValues<T extends TypedTextInput> = {
  readonly [K in keyof T]: T[K]["required"] extends true ? string : string | undefined;
}