import type {
  ButtonComponentHandler,
  ChannelSelectMenuComponentHandler,
  ComponentHandler,
  MentionableSelectMenuComponentHandler,
  ModalComponentHandler,
  RoleSelectMenuComponentHandler,
  StringSelectMenuComponentHandler,
  UserSelectMenuComponentHandler,
} from "#/base/components/component_handlers.type";
import type { ComponentError } from "#/utils";
import type { BaseError } from "@arcscord/better-error";
import type { Result } from "@arcscord/error";
import type { ComponentType } from "discord-api-types/v10";
import type { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

/**
 * @internal
 */
export type OldComponentList = {
  button: Map<string, ButtonComponentHandler>;
  stringSelect: Map<string, StringSelectMenuComponentHandler>;
  userSelect: Map<string, UserSelectMenuComponentHandler>;
  roleSelect: Map<string, RoleSelectMenuComponentHandler>;
  mentionableSelect: Map<string, MentionableSelectMenuComponentHandler>;
  channelSelect: Map<string, ChannelSelectMenuComponentHandler>;
  modal: Map<string, ModalComponentHandler>;
};

export type ComponentList = {
  [ComponentType.Button]: Map<string, ButtonComponentHandler>;
  [ComponentType.StringSelect]: Map<string, StringSelectMenuComponentHandler>;
  [ComponentType.UserSelect]: Map<string, UserSelectMenuComponentHandler>;
  [ComponentType.RoleSelect]: Map<string, RoleSelectMenuComponentHandler>;
  [ComponentType.MentionableSelect]: Map<string, MentionableSelectMenuComponentHandler>;
  [ComponentType.ChannelSelect]: Map<string, ChannelSelectMenuComponentHandler>;
  [ComponentType.TextInput]: Map<string, ModalComponentHandler>;
};

/**
 * all infos that you have aces to handle a component result
 */
export type ComponentResultHandlerInfos = {
  /**
   * The result of the component execution.
   */
  result: Result<string | true, ComponentError>;

  /**
   * The component handler object
   */
  component: ComponentHandler;

  /**
   * The DJS interaction object
   */
  interaction: MessageComponentInteraction | ModalSubmitInteraction;

  /**
   * Whether the response is deferred.
   */
  defer: boolean;

  /**
   * The start time of the component execution.
   */
  start: number;

  /**
   * The end time of the component execution.
   */
  end: number;
};

/**
 * all infos that you have aces to handle a component error
 */
export type ComponentErrorHandlerInfos = {
  /**
   * The error that occurred.
   */
  error: BaseError | ComponentError;

  /**
   * The component handler object
   */
  component?: ComponentHandler;

  /**
   * The DJS interaction object
   */
  interaction?: MessageComponentInteraction | ModalSubmitInteraction;

  /**
   * Whether the error is internal in arcscord (true) or from the component code (false)
   */
  internal: boolean;
};

/**
 * Type for handling component results.
 */
export type ComponentResultHandler = (
  infos: ComponentResultHandlerInfos
) => void | Promise<void>;

/**
 * Type for handling component errors.
 */
export type ComponentErrorHandler = (
  infos: ComponentErrorHandlerInfos
) => void | Promise<void>;

/**
 * Defines component manager options
 */
export type ComponentManagerOptions = {
  /**
   * Set a custom result handler
   * @default {@link ComponentManager.resultHandler}
   */
  resultHandler?: ComponentResultHandler;

  /**
   * Set a custom error handler
   * @default {@link ComponentManager.errorHandler}
   */
  errorHandler?: ComponentErrorHandler;
};
