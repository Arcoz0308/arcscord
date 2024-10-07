import type { Button } from "#/base";
import type {
  ChannelSelectMenu,
  ClickableButton,
  LinkButton,
  MentionableSelectMenu,
  RoleSelectMenu,
  StringSelectMenu,
  TextInput,
  TypedTextInput,
  UserSelectMenu,
} from "#/base/components/component_definer.type";
import type {
  ActionRowData,
  ButtonComponentData,
  ChannelSelectMenuComponentData,
  ComponentEmojiResolvable,
  MentionableSelectMenuComponentData,
  ModalComponentData,
  RoleSelectMenuComponentData,
  StringSelectMenuComponentData,
  TextInputComponentData,
  UserSelectMenuComponentData,
} from "discord.js";
import {
  buttonToAPI,
  selectMenuToAPI,
  textInputToAPI,
} from "#/base/components/build_component.util";
import { ComponentType } from "discord.js";

type BuildLinkButton = ((
  options: Omit<LinkButton, "type" | "style"> & { label: string },
) => LinkButton) &
((
  options: Omit<LinkButton, "type" | "style"> & {
    emoji: ComponentEmojiResolvable;
  },
) => LinkButton);

export const buildLinkButton: BuildLinkButton = (
  options: Omit<LinkButton, "type" | "style">,
): LinkButton => {
  return {
    ...options,
    type: "button",
    style: "link",
  };
};

type BuildClickableButton = ((
  options: Omit<ClickableButton, "type"> & { label: string },
) => ClickableButton) &
((
  options: Omit<ClickableButton, "type"> & {
    emoji: ComponentEmojiResolvable;
  },
) => ClickableButton);

export const buildClickableButton: BuildClickableButton = (
  options: Omit<ClickableButton, "type">,
): ClickableButton => {
  return {
    ...options,
    type: "button",
  };
};

type ButtonList =
  | [Button]
  | [Button, Button]
  | [Button, Button, Button]
  | [Button, Button, Button, Button]
  | [Button, Button, Button, Button, Button];

export function buildButtonActionRow(
  ...buttons: ButtonList
): ActionRowData<ButtonComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: buttons.map(button => buttonToAPI(button)),
  };
}

export function buildStringSelectMenu(
  options: Omit<StringSelectMenu, "type">,
): ActionRowData<StringSelectMenuComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      selectMenuToAPI({
        ...options,
        type: "stringSelect",
      }) as StringSelectMenuComponentData,
    ],
  };
}

export function buildUserSelectMenu(
  option: Omit<UserSelectMenu, "type">,
): ActionRowData<UserSelectMenuComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      selectMenuToAPI({
        ...option,
        type: "userSelect",
      }) as UserSelectMenuComponentData,
    ],
  };
}

export function buildRoleSelectMenu(
  option: Omit<RoleSelectMenu, "type">,
): ActionRowData<RoleSelectMenuComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      selectMenuToAPI({
        ...option,
        type: "roleSelect",
      }) as RoleSelectMenuComponentData,
    ],
  };
}

export function buildMentionableSelectMenu(
  option: Omit<MentionableSelectMenu, "type">,
): ActionRowData<MentionableSelectMenuComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      selectMenuToAPI({
        ...option,
        type: "mentionableSelect",
      }) as MentionableSelectMenuComponentData,
    ],
  };
}

export function buildChannelSelectMenu(
  option: Omit<ChannelSelectMenu, "type">,
): ActionRowData<ChannelSelectMenuComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: [
      selectMenuToAPI({
        ...option,
        type: "channelSelect",
      }) as ChannelSelectMenuComponentData,
    ],
  };
}

function isUntypedTextInput(
  input: Omit<TextInput, "type"> | TypedTextInput,
): input is Omit<TextInput, "type"> {
  return "label" in input && typeof input.label === "string";
}

type BuildModal = ((
  title: string,
  customId: string,
  textInput: TypedTextInput,
) => ModalComponentData) &
((
  title: string,
  customId: string,
  textInput: Omit<TextInput, "type">,
  ...textInputs: Omit<TextInput, "type">[]
) => ModalComponentData);

export const buildModal: BuildModal = (
  title: string,
  customId: string,
  textInput: Omit<TextInput, "type"> | TypedTextInput,
  ...textInputs: Omit<TextInput, "type">[]
): ModalComponentData => {
  let components: ActionRowData<TextInputComponentData>[];
  if (isUntypedTextInput(textInput)) {
    textInputs.unshift(textInput);
    components = textInputs.map((input) => {
      return {
        type: ComponentType.ActionRow,
        components: [textInputToAPI({ ...input, type: "textInput" })],
      };
    });
  }
  else {
    components = Object.keys(textInput).map((key) => {
      return {
        type: ComponentType.ActionRow,
        components: [
          textInputToAPI({
            ...textInput[key],
            customId: key,
            type: "textInput",
          }),
        ],
      };
    });
  }

  return {
    title,
    customId,
    components,
  };
};
