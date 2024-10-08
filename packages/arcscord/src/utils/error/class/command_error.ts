import type { CommandProps } from "#/base/command";
import type { BaseAutocompleteContext } from "#/base/command/autocomplete_context";
import type { BaseCommandContext } from "#/base/command/command_context";
import type { ErrorOptions } from "@arcscord/better-error";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { commandInteractionToString } from "#/base/command";
import { InteractionError } from "#/utils/error/class/interaction_error";

export type CommandErrorOptions = ErrorOptions & {
  ctx: BaseCommandContext | BaseAutocompleteContext;
};

export class CommandError extends InteractionError {
  name = "CommandError";

  interaction: CommandInteraction | AutocompleteInteraction;

  context: BaseCommandContext | BaseAutocompleteContext;

  command: CommandProps;

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
