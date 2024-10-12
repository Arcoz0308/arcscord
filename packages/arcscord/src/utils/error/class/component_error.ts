import type { InteractionErrorOptions } from "#/utils/error/class/interaction_error";
import type { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { InteractionError } from "#/utils/error/class/interaction_error";

/**
 * Options for creating a component error.
 */
export type ComponentErrorOptions = InteractionErrorOptions & {
  /**
   * The interaction associated with the error.
   */
  interaction: MessageComponentInteraction | ModalSubmitInteraction;
};

/**
 * Represents an error related to a Discord component interaction.
 */
export class ComponentError extends InteractionError {
  /**
   * The interaction associated with the error.
   */
  interaction: MessageComponentInteraction | ModalSubmitInteraction;

  /**
   * Creates a new instance of `ComponentError`.
   *
   * @param options - The options for creating the component error.
   */
  constructor(options: ComponentErrorOptions) {
    super(options);

    this.name = "ComponentError";

    this.interaction = options.interaction;
  }
}
