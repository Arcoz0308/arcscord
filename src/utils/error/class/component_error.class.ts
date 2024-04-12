import { InteractionError } from "#/utils/error/class/interaction_error.class";
import type { ComponentErrorOptions, DebugValueString } from "#/utils/error/error.type";
import type { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";

export class ComponentError extends InteractionError {

  interaction: MessageComponentInteraction|ModalSubmitInteraction;

  constructor(options: ComponentErrorOptions) {
    super(options);
    this.interaction = options.interaction;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];

    debugs.push(["customId", this.interaction.customId]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}