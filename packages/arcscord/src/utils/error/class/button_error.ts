import type { ComponentErrorOptions } from "#/utils/error/class/component_error";
import { ComponentError } from "#/utils/error/class/component_error";
import type { ButtonInteraction } from "discord.js";

export type ButtonErrorOptions = ComponentErrorOptions & {
  interaction: ButtonInteraction;
}

export class ButtonError extends ComponentError {

  interaction: ButtonInteraction;

  constructor(options: ButtonErrorOptions) {
    super(options);

    this.name = "ButtonError";

    this.interaction = options.interaction;
  }

}