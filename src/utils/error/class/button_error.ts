import { ComponentError, ComponentErrorOptions } from "#/utils/error/class/component_error";
import type { ButtonInteraction } from "discord.js";
import type { DebugValueString } from "#/utils/error/error.type";

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