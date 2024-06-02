import { InteractionError, InteractionErrorOptions } from "#/utils/error/class/interaction_error";
import type { DebugValueString } from "#/utils/error/error.type";
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

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];

    debugs.push(["customId", this.interaction.customId]);

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}