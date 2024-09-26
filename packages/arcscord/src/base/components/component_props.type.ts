import type { Button, ComponentType, TypedSelectMenuOptions } from "#/base/components/component_definer.type";
import type {
  ActionRowData,
  ChannelSelectMenuComponentData,
  MentionableSelectMenuComponentData,
  ModalComponentData,
  RoleSelectMenuComponentData,
  StringSelectMenuComponentData,
  UserSelectMenuComponentData
} from "discord.js";
import type { ButtonContext } from "#/base/components/context/button_context";
import type { ComponentRunResult } from "#/base/components/component.type";
import type {
  ChannelSelectMenuContext,
  MentionableSelectMenuContext,
  RoleSelectMenuContext,
  StringSelectMenuContext,
  UserSelectMenuContext
} from "#/base/components/context/select_menu_context";

export type MatcherType = "begin" | "full";

export type BaseComponentProps = {
  type: Exclude<ComponentType, "actionRow" | "textInput"> | "modal";
  matcher: string;

  /**
   * @default "begin"
   */
  matcherType?: MatcherType;
}

export type ButtonComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "button">;

  build: (...args: string[]) => Button;

  run: (ctx: ButtonContext) => Promise<ComponentRunResult>;
}

export type StringSelectMenuComponentProps<Typed extends TypedSelectMenuOptions | undefined = undefined> =
  BaseComponentProps
  & {
  type: Extract<BaseComponentProps["type"], "stringSelect">;

  build: (...args: string[]) => ActionRowData<StringSelectMenuComponentData>;

  run: (ctx: StringSelectMenuContext<Typed>) => Promise<ComponentRunResult>;

}
  & (Typed extends TypedSelectMenuOptions ? {
  values: Typed;
} : object);

export type UserSelectMenuComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "userSelect">;

  build: (...args: string[]) => ActionRowData<UserSelectMenuComponentData>;

  run: (ctx: UserSelectMenuContext) => Promise<ComponentRunResult>;
}

export type RoleSelectMenuComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "roleSelect">;

  build: (...args: string[]) => ActionRowData<RoleSelectMenuComponentData>;

  run: (ctx: RoleSelectMenuContext) => Promise<ComponentRunResult>;
}

export type MentionableSelectMenuComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "mentionableSelect">;

  build: (...args: string[]) => ActionRowData<MentionableSelectMenuComponentData>;

  run: (ctx: MentionableSelectMenuContext) => Promise<ComponentRunResult>;
}

export type ChannelSelectMenuComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "channelSelect">;

  build: (...args: string[]) => ActionRowData<ChannelSelectMenuComponentData>;

  run: (ctx: ChannelSelectMenuContext) => Promise<ComponentRunResult>;
}

export type ModalComponentProps = BaseComponentProps & {
  type: Extract<BaseComponentProps["type"], "modal">;

  build: (...args: string[]) => ModalComponentData;
}

export type ComponentProps =
  | ButtonComponentProps
  | StringSelectMenuComponentProps
  | UserSelectMenuComponentProps
  | RoleSelectMenuComponentProps
  | MentionableSelectMenuComponentProps
  | ChannelSelectMenuComponentProps
  | ModalComponentProps;