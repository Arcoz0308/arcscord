import type { CommandHandler } from "#/base";
import type { CommandError } from "#/utils";
import type { Result } from "@arcscord/error";
import type { CommandInteraction } from "discord.js";

/**
 * Information required for handling command results.
 */
export type CommandResultHandlerInfos = {
  /**
   * The result of the command execution.
   */
  result: Result<string | true, CommandError>;

  /**
   * The interaction associated with the command.
   */
  interaction: CommandInteraction;

  /**
   * The command properties associated with the command.
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
 * Type for handling command results.
 */
export type CommandResultHandler = (
  infos: CommandResultHandlerInfos
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
