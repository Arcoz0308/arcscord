import type { CommandHandler } from "#/base/command";
import type { AutocompleteContext } from "#/base/command/autocomplete_context";
import type { BaseCommandContext } from "#/base/command/command_context";
import type { ErrorOptions } from "@arcscord/better-error";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { commandInteractionToString } from "#/base/command";
import { InteractionError } from "#/utils/error/class/interaction_error";

/**
 * Options for creating a CommandError.
 */
export type CommandErrorOptions = ErrorOptions & {
  /**
   * The context of the command.
   */
  ctx: BaseCommandContext | AutocompleteContext;
};

/**
 * Represents an error that occurred during the execution of a command.
 */
export class CommandError extends InteractionError {
  /**
   * The name of the error.
   */
  name = "CommandError";

  /**
   * The interaction associated with the error.
   */
  interaction: CommandInteraction | AutocompleteInteraction;

  /**
   * The context associated with the command error.
   */
  context: BaseCommandContext | AutocompleteContext;

  /**
   * The command properties associated with the error.
   */
  command: CommandHandler;

  /**
   * Creates a new instance of `CommandError`.
   *
   * @param options - The options for creating the command error.
   */
  constructor(options: CommandErrorOptions) {
    super({ ...options, interaction: options.ctx.interaction });

    this.interaction = options.ctx.interaction;
    this.context = options.ctx;
    this.command = options.ctx.command;
    this._debugs.set(
      "Command",
      commandInteractionToString(options.ctx.interaction),
    );
  }
}
