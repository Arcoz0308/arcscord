import type { ComponentErrorOptions } from "#/utils/error/class/component_error";
import { ComponentError } from "#/utils/error/class/component_error";
import type { AnySelectMenuInteraction } from "discord.js";

export type SelectMenuErrorOptions = ComponentErrorOptions & {
  interaction: AnySelectMenuInteraction;
}

export class SelectMenuError extends ComponentError {

  interaction: AnySelectMenuInteraction;

  constructor(options: SelectMenuErrorOptions) {
    super(options);

    this.name = "SelectMenuError";

    this.interaction = options.interaction;
  }

}