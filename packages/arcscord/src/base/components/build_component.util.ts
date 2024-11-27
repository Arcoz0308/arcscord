import type {
  AnySelectMenuComponentData,
  Button,
  SelectMenu,
  SelectOptions,
  TextInput,
  TypedSelectMenuOptions,
} from "#/base/components/component_definer.type";
import type {
  APISelectMenuDefaultValue,
  ButtonComponentData,
  SelectMenuDefaultValueType as DJSSelectMenuDefaultValueType,
  SelectMenuComponentOptionData,
  TextInputComponentData,
} from "discord.js";
import {
  buttonTypeEnum,
  textInputStyleEnum,
} from "#/base/components/component.enum";
import { channelTypeEnum } from "#/utils/discord/type/channel.enum";
import { ComponentType } from "discord-api-types/v10";

export function buttonToAPI(button: Button): ButtonComponentData {
  if ("customId" in button) {
    return {
      type: ComponentType.Button,
      style: typeof button.style === "string" ? buttonTypeEnum[button.style] : button.style,
      customId: button.customId,
      label: button.label,
      emoji: button.emoji,
      disabled: button.disabled,
    };
  }
  return {
    type: ComponentType.Button,
    style: typeof button.style === "string" ? buttonTypeEnum[button.style] : button.style,
    url: button.url,
    label: button.label,
    emoji: button.emoji,
    disabled: button.disabled,
  };
}

export function selectMenuOptionsToAPI(
  options: string[] | SelectOptions[] | TypedSelectMenuOptions,
): SelectMenuComponentOptionData[] {
  if (!Array.isArray(options)) {
    return Object.keys(options).map((key) => {
      const option = options[key];
      if (typeof option === "string") {
        return {
          label: key,
          value: option,
        };
      }

      return {
        ...option,
        value: key,
      };
    });
  }

  if (options.every(item => typeof item === "string")) {
    return options.map((option) => {
      return {
        label: option as string,
        value: option as string,
      };
    });
  }
  return options as SelectMenuComponentOptionData[];
}

export function selectMenuToAPI(
  selectMenu: SelectMenu,
): AnySelectMenuComponentData {
  if (selectMenu.type === ComponentType.StringSelect) {
    return {
      type: ComponentType.StringSelect,
      customId: selectMenu.customId,
      placeholder: selectMenu.placeholder,
      disabled: selectMenu.disabled,
      minValues: selectMenu.minValues,
      maxValues: selectMenu.maxValues,
      options: selectMenuOptionsToAPI(selectMenu.options),
    };
  }

  if (selectMenu.type === ComponentType.ChannelSelect) {
    return {
      type: ComponentType.ChannelSelect,
      customId: selectMenu.customId,
      placeholder: selectMenu.placeholder,
      disabled: selectMenu.disabled,
      minValues: selectMenu.minValues,
      maxValues: selectMenu.maxValues,
      defaultValues: selectMenu.defaultValues as // fix error with enum
      | APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.Channel>[]
      | undefined,
      channelTypes: selectMenu.channelTypes
        ? selectMenu.channelTypes.map(type => channelTypeEnum[type])
        : undefined,
    };
  }

  if (selectMenu.type === ComponentType.UserSelect) {
    return {
      type: ComponentType.UserSelect,
      customId: selectMenu.customId,
      placeholder: selectMenu.placeholder,
      disabled: selectMenu.disabled,
      minValues: selectMenu.minValues,
      maxValues: selectMenu.maxValues,
      defaultValues: selectMenu.defaultValues as
      | APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.User>[]
      | undefined,
    };
  }

  if (selectMenu.type === ComponentType.RoleSelect) {
    return {
      type: ComponentType.RoleSelect,
      customId: selectMenu.customId,
      placeholder: selectMenu.placeholder,
      disabled: selectMenu.disabled,
      minValues: selectMenu.minValues,
      maxValues: selectMenu.maxValues,
      defaultValues: selectMenu.defaultValues as
      | APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.Role>[]
      | undefined,
    };
  }

  return {
    type: ComponentType.MentionableSelect,
    customId: selectMenu.customId,
    placeholder: selectMenu.placeholder,
    disabled: selectMenu.disabled,
    minValues: selectMenu.minValues,
    maxValues: selectMenu.maxValues,
    defaultValues: selectMenu.defaultValues as
    | APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.User | DJSSelectMenuDefaultValueType.Role>[]
    | undefined,
  };
}

export function textInputToAPI(textInput: TextInput): TextInputComponentData {
  return {
    type: ComponentType.TextInput,
    customId: textInput.customId,
    label: textInput.label,
    style: textInputStyleEnum[textInput.style],
    minLength: textInput.minLength,
    maxLength: textInput.maxLength,
    required: textInput.required,
    value: textInput.value,
    placeholder: textInput.placeholder,
  };
}
