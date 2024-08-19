import type { Command, CommandRunContext, CommandRunResult } from "#/base/command";
import type { ArcClient } from "#/base/client/client.class";
import type { InteractionEditReplyOptions, InteractionReplyOptions, MessagePayload } from "discord.js";
import type { CommandError } from "#/utils";
import { error, ok } from "@arcscord/error";

export abstract class SubCommand {

  baseCommand: Command;

  abstract subName: string;

  subGroup: string|null = null;

  client: ArcClient;

  name: string = "no_name";

  constructor(client: ArcClient, baseCommand: Command) {
    this.client = client;

    this.baseCommand = baseCommand;
    this.setName();
  }

  abstract run(ctx: CommandRunContext): Promise<CommandRunResult>

  setName(): void {
    this.name = this.baseCommand.name;
  }

  fullName(): string {
    if (this.subGroup !== null) {
      return `${this.name}-${this.subGroup}-${this.subName}`;
    }
    return `${this.name}-${this.subName}`;
  }

  reply(ctx: CommandRunContext,  message: string | MessagePayload | InteractionReplyOptions): Promise<CommandRunResult> {
    return this.baseCommand.reply(ctx, message);
  }

  editReply(ctx: CommandRunContext,  message: string | MessagePayload | InteractionEditReplyOptions): Promise<CommandRunResult> {
    return this.baseCommand.editReply(ctx, message);
  }

  error(err: CommandError): CommandRunResult {
    return error(err);
  }

  ok(value: true|string): CommandRunResult {
    return ok(value);
  }

}