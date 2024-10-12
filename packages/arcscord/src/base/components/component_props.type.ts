import type { ComponentRunResult } from "#/base/components/component.type";
import type { Button, ComponentType, TypedSelectMenuOptions } from "#/base/components/component_definer.type";
import type { ButtonContext } from "#/base/components/context/button_context";
import type { ModalContext } from "#/base/components/context/modal_context";
import type {
  ChannelSelectMenuContext,
  MentionableSelectMenuContext,
  RoleSelectMenuContext,
  StringSelectMenuContext,
  UserSelectMenuContext,
} from "#/base/components/context/select_menu_context";
import type {
  ActionRowData,
  ChannelSelectMenuComponentData,
  MentionableSelectMenuComponentData,
  ModalComponentData,
  RoleSelectMenuComponentData,
  StringSelectMenuComponentData,
  UserSelectMenuComponentData,
} from "discord.js";

/**
 * the type of match for custom id
 */
export type MatcherType = "begin" | "full";

/**
 * Base properties for all component types.
 */
export type BaseComponentProps = {
  /**
   * The type of the component.
   */
  type: Exclude<ComponentType, "actionRow" | "textInput"> | "modal";

  /**
   * The matcher string, it compares with customId by type defined in {@link BaseComponentProps.matcherType|matcherType}.
   */
  matcher: string;

  /**
   * the type of matcher, begin -> the beginning of custom id, full -> perfect match
   * @default "begin"
   */
  matcherType?: MatcherType;

  /**
   * Whether to pre-reply.
   */
  preReply?: boolean;

  /**
   * Whether the pre-reply should be ephemeral.
   */
  ephemeralPreReply?: boolean;
};

/**
 * Properties for a button component.
 */
export type ButtonComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "button">;

  /**
   * Function to build the button.
   */
  build: (...args: O) => Button;

  /**
   * Function to run when the button is clicked.
   */
  run: (ctx: ButtonContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a string select menu component.
 */
export type StringSelectMenuComponentProps<
  O extends string[] = string[],
  Typed extends TypedSelectMenuOptions | undefined = undefined,
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "stringSelect">;

  /**
   * Function to build the string select menu.
   */
  build: (...args: O) => ActionRowData<StringSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: StringSelectMenuContext<Typed>) => Promise<ComponentRunResult>;
} & (Typed extends TypedSelectMenuOptions
  ? {
      values: Typed;
    }
  : object);

/**
 * Properties for a user select menu component.
 */
export type UserSelectMenuComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "userSelect">;

  /**
   * Function to build the user select menu.
   */
  build: (...args: O) => ActionRowData<UserSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: UserSelectMenuContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a role select menu component.
 */
export type RoleSelectMenuComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "roleSelect">;

  /**
   * Function to build the role select menu.
   */
  build: (...args: O) => ActionRowData<RoleSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: RoleSelectMenuContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a mentionable select menu component.
 */
export type MentionableSelectMenuComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "mentionableSelect">;

  /**
   * Function to build the mentionable select menu.
   */
  build: (...args: O) => ActionRowData<MentionableSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: MentionableSelectMenuContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a channel select menu component.
 */
export type ChannelSelectMenuComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "channelSelect">;

  /**
   * Function to build the channel select menu.
   */
  build: (...args: O) => ActionRowData<ChannelSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: ChannelSelectMenuContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a modal component.
 */
export type ModalComponentProps<O extends string[] = string[]> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "modal">;

  /**
   * Function to build the modal.
   */
  build: (...args: O) => ModalComponentData;

  /**
   * Function to run when the modal is submitted.
   */
  run: (ctx: ModalContext) => Promise<ComponentRunResult>;
};

/**
 * Properties for a select menu component.
 */
export type SelectMenuComponentProps<
  O extends string[] = string[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> = StringSelectMenuComponentProps<O, T>
| UserSelectMenuComponentProps<O>
| RoleSelectMenuComponentProps<O>
| MentionableSelectMenuComponentProps<O>
| ChannelSelectMenuComponentProps<O>;

/**
 * Union type for all component properties.
 */
export type ComponentProps =
  | ButtonComponentProps
  | SelectMenuComponentProps
  | ModalComponentProps;
