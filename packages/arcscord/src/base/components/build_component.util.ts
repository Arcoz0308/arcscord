import type {
  AnySelectMenuComponentData,
  Button,
  SelectMenu,
  SelectOptions,
  TextInput,
  TypedSelectMenuOptions
} from "#/base/components/component_definer.type";
import type {
  APISelectMenuDefaultValue,
  ButtonComponentData,
  SelectMenuComponentOptionData,
  SelectMenuDefaultValueType as DJSSelectMenuDefaultValueType,
  TextInputComponentData
} from "discord.js";
import { ComponentType } from "discord.js";
import { buttonTypeEnum, componentTypesEnum, textInputStyleEnum } from "#/base/components/component.enum";
import { channelTypeEnum } from "#/utils/discord/type/channel.enum";

export const buttonToAPI = (button: Button): ButtonComponentData => {
  if ("customId" in button) {
    return {
      type: ComponentType.Button,
      style: buttonTypeEnum[button.style],
      customId: button.customId,
      label: button.label,
      emoji: button.emoji,
      disabled: button.disabled,
    };
  }
  return {
    type: ComponentType.Button,
    style: buttonTypeEnum[button.style],
    url: button.url,
    label: button.label,
    emoji: button.emoji,
    disabled: button.disabled,
  };
};

export const selectMenuOptionsToAPI = (options: string[] | SelectOptions[] | TypedSelectMenuOptions): SelectMenuComponentOptionData[] => {
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

  if (options.every((item) => typeof item === "string")) {
    return options.map((option) => {
      return {
        label: option as string,
        value: option as string,
      };
    });
  }
  return options as SelectMenuComponentOptionData[];
};

export const selectMenuToAPI = (selectMenu: SelectMenu): AnySelectMenuComponentData => {
  if (selectMenu.type === "stringSelect") {
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

  if (selectMenu.type === "channelSelect") {
    return {
      type: ComponentType.ChannelSelect,
      customId: selectMenu.customId,
      placeholder: selectMenu.placeholder,
      disabled: selectMenu.disabled,
      minValues: selectMenu.minValues,
      maxValues: selectMenu.maxValues,
      defaultValues: selectMenu.defaultValues as //fix error with enum
        APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.Channel>[] | undefined,
      channelTypes: selectMenu.channelTypes
        ? selectMenu.channelTypes.map((type) => channelTypeEnum[type]) : undefined,
    };
  }

  return {
    type: componentTypesEnum[selectMenu.type],
    customId: selectMenu.customId,
    placeholder: selectMenu.placeholder,
    disabled: selectMenu.disabled,
    minValues: selectMenu.minValues,
    maxValues: selectMenu.maxValues,
    defaultValues: selectMenu.defaultValues as //fix error with enum
      APISelectMenuDefaultValue<DJSSelectMenuDefaultValueType.Role | DJSSelectMenuDefaultValueType.User>[] | undefined,
  };
};

export const textInputToAPI = (textInput: TextInput): TextInputComponentData => {
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
};