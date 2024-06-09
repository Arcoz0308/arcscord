import type { ComponentErrorOptions } from "#/utils/error/class/component_error";
import { ComponentError } from "#/utils/error/class/component_error";
import type { AnySelectMenuInteraction } from "discord.js";
import type { DebugValueString } from "#/utils/error/error.type";

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

  getDebugsString(): DebugValueString[] {

    const debugs: DebugValueString[] = [];
    debugs.push(["selectValues", `"${this.interaction.values.join("\", \"")}"`]);


    debugs.push(...super.getDebugsString());

    return debugs;
  }

}