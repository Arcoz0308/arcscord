import type { Command, CommandRunContext, CommandRunResult } from "#/base/command";
import type { Client } from "#/base/client/client.class";
import { InteractionBase } from "#/base/interaction/interaction.class";

export abstract class SubCommand extends InteractionBase {

  baseCommand: Command;

  abstract subName: string;

  subGroup: string|null = null;

  constructor(client: Client, baseCommand: Command) {
    super(client);

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

}