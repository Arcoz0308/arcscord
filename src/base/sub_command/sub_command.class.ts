import { Command } from "#/base/command";
import type { Client } from "#/base/client/client.class";

export abstract class SubCommand extends Command {

  baseCommand: Command;

  abstract subName: string;

  subGroup: string|null = null;

  protected constructor(client: Client, baseCommand: Command) {
    super(client);

    this.baseCommand = baseCommand;
    this.setName();
  }

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