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
import { buttonToAPI, selectMenuToAPI, textInputToAPI } from "#/base/components/build_component.util";
import { ComponentType } from "discord.js";

/**
 * Build a link button
 * @param options options of link button
 * @example
 * ```ts
 * buildLinkButton({
 *   url: "https://discord.com",
 *   label: "Discord",
 * });
 * ```
 */
export function buildLinkButton(
  options: Omit<LinkButton, "type" | "style"> & { label: string }
): LinkButton;
/**
 * Build a link button
 * @param options options of link button
 * @example
 * ```ts
 * buildLinkButton({
 *   url: "https://discord.com",
 *   label: "Discord",
 * });
 * ```
 */
export function buildLinkButton(
  options: Omit<LinkButton, "type" | "style"> & { emoji: ComponentEmojiResolvable }
): LinkButton;

export function buildLinkButton(
  options: Omit<LinkButton, "type" | "style">,
): LinkButton {
  return {
    ...options,
    type: "button",
    style: "link",
  };
}

/**
 * Build a clickable button
 * @param options options of the clickable button
 * @example
 * ```ts
 * buildClickableButton({
 *   style: "primary",
 *   label: "Click here",
 *   customId: "Yeah",
 *   emoji: "❤️",
 * });
 * ```
 */
export function buildClickableButton(
  options: Omit<ClickableButton, "type"> & { label: string }
): ClickableButton;
/**
 * Build a clickable button
 * @param options options of the clickable button
 * @example
 * ```ts
 * buildClickableButton({
 *   style: "primary",
 *   label: "Click here",
 *   customId: "Yeah",
 *   emoji: "❤️",
 * });
 * ```
 */
export function buildClickableButton(
  options: Omit<ClickableButton, "type"> & { emoji: ComponentEmojiResolvable }
): ClickableButton;

export function buildClickableButton(
  options: Omit<ClickableButton, "type">,
): ClickableButton {
  return {
    ...options,
    type: "button",
  };
}

type ButtonList =
  | [Button]
  | [Button, Button]
  | [Button, Button, Button]
  | [Button, Button, Button, Button]
  | [Button, Button, Button, Button, Button];

/**
 * Make an actionRow of buttons
 * @param buttons buttons list
 */
export function buildButtonActionRow(
  ...buttons: ButtonList
): ActionRowData<ButtonComponentData> {
  return {
    type: ComponentType.ActionRow,
    components: buttons.map(button => buttonToAPI(button)),
  };
}

/**
 * Build a string select menu
 * @param options options of the string select menu
 * @example
 * ```ts
 * buildStringSelectMenu({
 *   customId: "select-1",
 *   options: [
 *     { label: "Option 1", value: "1" },
 *     { label: "Option 2", value: "2" },
 *   ],
 *   placeholder: "Choose an option",
 *   minValues: 1,
 *   maxValues: 1,
 * });
 * ```
 */
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

/**
 * Build a user select menu
 * @param option options of the user select menu
 * @example
 * ```ts
 * buildUserSelectMenu({
 *   customId: "user-select-1",
 * });
 * ```
 */
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

/**
 * Build a role select menu
 * @param option options of the role select menu
 * @example
 * ```ts
 * buildRoleSelectMenu({
 *   customId: "role-select-1",
 *   placeholder: "Select a role",
 *   maxValues: 25,
 * });
 * ```
 */
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

/**
 * Build a mentionable select menu
 * @param option options of the mentionable select menu
 * @example
 * ```ts
 * buildMentionableSelectMenu({
 *   customId: "mention-select-1",
 *   defaultValues: [
 *     {
 *       id: "858220958378441754",
 *       type: "user",
 *     },
 *   ],
 * });
 * ```
 */
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

/**
 * Build a channel select menu
 * @param option options of the channel select menu
 * @example
 * ```ts
 * buildChannelSelectMenu({
 *   customId: "channel-select-1",
 *   placeholder: "Select a channel",
 *   channelTypes: ["guildText", "guildVoice"],
 * });
 * ```
 */
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

/**
 * Build a typed modal (Soon)
 * @param title - The title of the modal
 * @param customId - The custom ID of the modal
 * @param textInput - Typed text input
 * @example
 * ```ts
 * buildModal("My Modal", "modal-1", {
 *   name: {
 *     style: "short",
 *     label: "Name",
 *   },
 *   presentation: {
 *     style: "paragraph",
 *     label: "Presentation",
 *   },
 * });
 * ```
 */
export function buildModal(
  title: string,
  customId: string,
  textInput: TypedTextInput
): ModalComponentData;
/**
 * Build a modal
 * @param title - The title of the modal
 * @param customId - The custom ID of the modal
 * @param textInput - A single text input component
 * @param textInputs - Additional text input components
 * @example
 * ```ts
 * buildModal("My Modal", "modal-1", {
 *   input1: {
 *     label: "Label 1",
 *     style: "short",
 *   },
 *   input2: {
 *     label: "Label 2",
 *     style: "paragraph",
 *   },
 * });
 * ```
 */
export function buildModal(
  title: string,
  customId: string,
  textInput: Omit<TextInput, "type">,
  ...textInputs: Omit<TextInput, "type">[]
): ModalComponentData;

export function buildModal(
  title: string,
  customId: string,
  textInput: Omit<TextInput, "type"> | TypedTextInput,
  ...textInputs: Omit<TextInput, "type">[]
): ModalComponentData {
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
}
