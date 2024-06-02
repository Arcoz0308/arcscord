import { BaseError, ErrorOptions } from "#/utils/error/class/base_error";
import type { DebugValueString } from "#/utils/error/error.type";
import type { BaseInteraction } from "discord.js";

export type InteractionErrorOptions = ErrorOptions & {
  interaction: BaseInteraction;
}

export class InteractionError extends BaseError {

  interaction: BaseInteraction;

  constructor(options: InteractionErrorOptions) {
    super(options);

    this.name = "InteractionError";

    this.interaction = options.interaction;
  }

  getDebugsString(): DebugValueString[] {
    const debugs: DebugValueString[] = [];
    debugs.push(["author", `${this.interaction.user.username} (${this.interaction.user.id})`]);

    if (this.interaction.inGuild()) {
      debugs.push(["channel", `${this.interaction.channelId ?? "no channel"} (guild : ${this.interaction.guildId ?? "no guild"})`]);
    } else {
      debugs.push(["channel", "in dm"]);
    }

    debugs.push(...super.getDebugsString());
    return debugs;
  }

}