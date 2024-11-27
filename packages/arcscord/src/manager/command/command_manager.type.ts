import type { CommandContext, CommandHandler } from "#/base";
import type { CommandError } from "#/utils";
import type { BaseError } from "@arcscord/better-error";
import type { Result } from "@arcscord/error";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";

/**
 * all infos that you have aces to handle a command result
 */
export type CommandResultHandlerInfos = {
  /**
   * The result of the command execution.
   */
  result: Result<string | true, CommandError>;

  /**
   * The DJS interaction object
   */
  interaction: CommandInteraction;

  /**
   * The command properties
   */
  command: CommandHandler;

  /**
   * Whether the response is deferred.
   */
  defer: boolean;

  /**
   * The start time of the command execution.
   */
  start: number;

  /**
   * The end time of the command execution.
   */
  end: number;
};

/**
 * Base information required for handling command errors.
 */
type BaseCommandErrorHandlerInfos = {
  /**
   * The error that occurred.
   */
  error: CommandError | BaseError;

  /**
   * The command properties associated with the command.
   */
  command?: CommandHandler;

  /**
   * The context associated with the command.
   */
  context?: CommandContext;

  /**
   * Whether the error is internal in arcscord (true) or from the command code (false)
   */
  internal: boolean;
};

/**
 * Information required for handling autocomplete command errors.
 */
type AutocompleteErrorHandlerInfos = BaseCommandErrorHandlerInfos & {
  /**
   * The interaction associated with the command.
   */
  interaction: AutocompleteInteraction;
  autocomplete: true;
};

/**
 * Information required for handling regular command errors.
 */
type RegularCommandErrorHandlerInfos = BaseCommandErrorHandlerInfos & {
  /**
   * The interaction associated with the command.
   */
  interaction: CommandInteraction;
  autocomplete?: false;
};

/**
 * Information required for handling command errors.
 */
export type CommandErrorHandlerInfos =
  | AutocompleteErrorHandlerInfos
  | RegularCommandErrorHandlerInfos;

/**
 * Type for handling command results.
 */
export type CommandResultHandler = (
  infos: CommandResultHandlerInfos
) => void | Promise<void>;

/**
 * Type for handling command errors.
 */
export type CommandErrorHandler = (
  infos: CommandErrorHandlerInfos
) => void | Promise<void>;

/**
 * Interface for implementing command result handler.
 */
export type CommandResultHandlerImplementer = {
  /**
   * Handles the result of a command.
   * @param infos - The information required to handle the command result.
   */
  resultHandler: CommandResultHandler;
};

/**
 * Defines command manager options
 */
export type CommandManagerOptions = {
  /**
   * Set a custom result handler
   * @default {@link CommandManager.resultHandler}
   */
  resultHandler?: CommandResultHandler;

  /**
   * Set a custom error handler
   * @default {@link CommandManager.errorHandler}
   */
  errorHandler?: CommandErrorHandler;
};
