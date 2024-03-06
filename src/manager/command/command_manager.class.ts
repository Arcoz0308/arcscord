import type { Client } from "#/base/client/client.class";
import type { Command } from "#/base/command/command.class";

export class CommandManager {

  commands: Map<string, Command> = new Map();

  constructor(public client: Client) {
  }

}