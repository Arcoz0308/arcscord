import type { DebugValueString } from "#/utils/error/error.type";
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

  getDebugsString(): DebugValueString[] {

    const debugs: DebugValueString[] = [];

    const values = this.interaction.fields.fields.map((field) => `${field.customId}: ${field.value}`);
    debugs.push(["values", `"${values.join("\", \"")}"`]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}