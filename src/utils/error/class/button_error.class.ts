import { ComponentError } from "#/utils/error/class/component_error.class";
import type { ButtonInteraction } from "discord.js";
import type { ButtonErrorOptions, DebugValueString } from "#/utils/error/error.type";

export class ButtonError extends ComponentError {

  interaction: ButtonInteraction;

  constructor(options: ButtonErrorOptions) {
    super(options);

    this.interaction = options.interaction;
  }

  getDebugsString(): DebugValueString[] {

    const debugs: DebugValueString[] = [];

    debugs.push(["label", this.interaction.component.label ?? "no_label"]);

    if (this.interaction.message.interaction?.commandName) {
      debugs.push(["commandName", this.interaction.message.interaction.commandName]);
    }

    debugs.push(...super.getDebugsString());

    return debugs;
  }

}