import type { BaseCommandRunContext, Command, CommandRunResult, SubCommandRunContext } from "#/base/command";
import type { ArcClient } from "#/base/client/client.class";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import type { SubCommandDefinition } from "#/base/command/command_definition.type";

export abstract class SubCommand<T extends SubCommandDefinition = { name: string; description: string }> {

  baseCommand: Command;

  abstract subName: string;

  subGroup: string|null = null;

  client: ArcClient;

  name: string = "no_name";

  definer: T;

  constructor(client: ArcClient, baseCommand: Command, definer: T) {
    this.client = client;

    this.baseCommand = baseCommand;
    this.setName();
    this.definer = definer;
  }

  abstract run(ctx: SubCommandRunContext<T>): Promise<CommandRunResult>

  setName(): void {
    this.name = this.baseCommand.name;
  }

  fullName(): string {
    if (this.subGroup !== null) {
      return `${this.name}-${this.subGroup}-${this.subName}`;
    }
    return `${this.name}-${this.subName}`;
  }

  reply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionReplyOptions): Promise<CommandRunResult> {
    return this.baseCommand.reply(ctx, message);
  }

  editReply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionEditReplyOptions): Promise<CommandRunResult> {
    return this.baseCommand.editReply(ctx, message);
  }


}