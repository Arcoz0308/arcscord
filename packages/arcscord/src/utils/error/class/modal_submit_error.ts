import type { ComponentErrorOptions } from "#/utils/error/class/component_error";
import { ComponentError } from "#/utils/error/class/component_error";
import type { ModalSubmitInteraction } from "discord.js";

export type ModalSubmitErrorOptions = ComponentErrorOptions & {
  interaction: ModalSubmitInteraction;
}

export class ModalSubmitError extends ComponentError {

  interaction: ModalSubmitInteraction;


  constructor(options: ModalSubmitErrorOptions) {
    super(options);

    this.name = "ModalSubmitError";

    this.interaction = options.interaction;

  }

}