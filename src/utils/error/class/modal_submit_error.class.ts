import type { DebugValueString, ModalSubmitErrorOptions } from "#/utils/error/error.type";
import { ComponentError } from "#/utils/error/class/component_error.class";
import type { ModalSubmitInteraction } from "discord.js";

export class ModalSubmitError extends ComponentError {

  interaction: ModalSubmitInteraction;


  constructor(options: ModalSubmitErrorOptions) {
    super(options);

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