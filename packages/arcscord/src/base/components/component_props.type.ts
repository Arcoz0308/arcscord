import type { ComponentRunResult } from "#/base/components/component.type";
import type { Button, ComponentType, TypedSelectMenuOptions } from "#/base/components/component_definer.type";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
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
export type BaseComponentProps<Middlewares extends ComponentMiddleware[] = ComponentMiddleware[]> = {
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

  use?: Middlewares;
};

/**
 * Properties for a button component.
 */
export type ButtonComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps<M> & {
  type: Extract<BaseComponentProps["type"], "button">;

  /**
   * Function to build the button.
   */
  build: (...args: O) => Button;

  /**
   * Function to run when the button is clicked.
   */
  run: (ctx: ButtonContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a string select menu component.
 */
export type StringSelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
  Typed extends TypedSelectMenuOptions | undefined = undefined,
> = BaseComponentProps<M> & {
  type: Extract<BaseComponentProps["type"], "stringSelect">;

  /**
   * Function to build the string select menu.
   */
  build: (...args: O) => ActionRowData<StringSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: StringSelectMenuContext<M, Typed>) => Promise<ComponentRunResult>;
} & (Typed extends TypedSelectMenuOptions ? { values: Typed } : NonNullable<unknown>);

/**
 * Properties for a user select menu component.
 */
export type UserSelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "userSelect">;

  /**
   * Function to build the user select menu.
   */
  build: (...args: O) => ActionRowData<UserSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: UserSelectMenuContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a role select menu component.
 */
export type RoleSelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "roleSelect">;

  /**
   * Function to build the role select menu.
   */
  build: (...args: O) => ActionRowData<RoleSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: RoleSelectMenuContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a mentionable select menu component.
 */
export type MentionableSelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "mentionableSelect">;

  /**
   * Function to build the mentionable select menu.
   */
  build: (...args: O) => ActionRowData<MentionableSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: MentionableSelectMenuContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a channel select menu component.
 */
export type ChannelSelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "channelSelect">;

  /**
   * Function to build the channel select menu.
   */
  build: (...args: O) => ActionRowData<ChannelSelectMenuComponentData>;

  /**
   * Function to run when the select menu is used.
   */
  run: (ctx: ChannelSelectMenuContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a modal component.
 */
export type ModalComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "modal">;

  /**
   * Function to build the modal.
   */
  build: (...args: O) => ModalComponentData;

  /**
   * Function to run when the modal is submitted.
   */
  run: (ctx: ModalContext<M>) => Promise<ComponentRunResult>;
};

/**
 * Properties for a select menu component.
 */
export type SelectMenuComponentProps<
  O extends string[] = string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
> = StringSelectMenuComponentProps<O, M>
| UserSelectMenuComponentProps<O, M>
| RoleSelectMenuComponentProps<O, M>
| MentionableSelectMenuComponentProps<O, M>
| ChannelSelectMenuComponentProps<O, M>;

/**
 * Union type for all component properties.
 */
export type ComponentProps =
  | ButtonComponentProps
  | SelectMenuComponentProps
  | ModalComponentProps;
