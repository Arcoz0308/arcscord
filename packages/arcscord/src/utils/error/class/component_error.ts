import type { InteractionErrorOptions } from "#/utils/error/class/interaction_error";
import { InteractionError } from "#/utils/error/class/interaction_error";
import type { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

export type ComponentErrorOptions = InteractionErrorOptions & {
  interaction: MessageComponentInteraction|ModalSubmitInteraction;
}

export class ComponentError extends InteractionError {

  interaction: MessageComponentInteraction|ModalSubmitInteraction;

  constructor(options: ComponentErrorOptions) {
    super(options);

    this.name = "ComponentError";

    this.interaction = options.interaction;
  }

}