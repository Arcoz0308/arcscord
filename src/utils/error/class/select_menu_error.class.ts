import { ComponentError } from "#/utils/error/class/component_error.class";
import type { AnySelectMenuInteraction } from "discord.js";
import type { DebugValueString, SelectMenuErrorOptions } from "#/utils/error/error.type";

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