import type { ComponentRunResult } from "#/base/components/component.type";
import type {
  Button,
  ComponentType,
  TypedSelectMenuOptions,
} from "#/base/components/component_definer.type";
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

export type MatcherType = "begin" | "full";

export type BaseComponentProps = {
  type: Exclude<ComponentType, "actionRow" | "textInput"> | "modal";
  matcher: string;

  /**
   * @default "begin"
   */
  matcherType?: MatcherType;
  preReply?: boolean;
  ephemeralPreReply?: boolean;
};

export type ButtonComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "button">;

    build: (...args: O) => Button;

    run: (ctx: ButtonContext) => Promise<ComponentRunResult>;
  };

export type StringSelectMenuComponentProps<
  O extends string[] = string[],
  Typed extends TypedSelectMenuOptions | undefined = undefined,
> = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "stringSelect">;

  build: (...args: O) => ActionRowData<StringSelectMenuComponentData>;

  run: (ctx: StringSelectMenuContext<Typed>) => Promise<ComponentRunResult>;
} & (Typed extends TypedSelectMenuOptions
  ? {
      values: Typed;
    }
  : object);

export type UserSelectMenuComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "userSelect">;

    build: (...args: O) => ActionRowData<UserSelectMenuComponentData>;

    run: (ctx: UserSelectMenuContext) => Promise<ComponentRunResult>;
  };

export type RoleSelectMenuComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "roleSelect">;

    build: (...args: O) => ActionRowData<RoleSelectMenuComponentData>;

    run: (ctx: RoleSelectMenuContext) => Promise<ComponentRunResult>;
  };

export type MentionableSelectMenuComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "mentionableSelect">;

    build: (...args: O) => ActionRowData<MentionableSelectMenuComponentData>;

    run: (ctx: MentionableSelectMenuContext) => Promise<ComponentRunResult>;
  };

export type ChannelSelectMenuComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "channelSelect">;

    build: (...args: O) => ActionRowData<ChannelSelectMenuComponentData>;

    run: (ctx: ChannelSelectMenuContext) => Promise<ComponentRunResult>;
  };

export type ModalComponentProps<O extends string[] = string[]> =
  BaseComponentProps & {
    type: Extract<BaseComponentProps["type"], "modal">;

    build: (...args: O) => ModalComponentData;

    run: (ctx: ModalContext) => Promise<ComponentRunResult>;
  };

export type SelectMenuComponentProps<
  O extends string[] = string[],
  T extends TypedSelectMenuOptions | undefined = undefined,
> =
  | StringSelectMenuComponentProps<O, T>
  | UserSelectMenuComponentProps<O>
  | RoleSelectMenuComponentProps<O>
  | MentionableSelectMenuComponentProps<O>
  | ChannelSelectMenuComponentProps<O>;

export type ComponentProps =
  | ButtonComponentProps
  | SelectMenuComponentProps
  | ModalComponentProps;
