import type { Command } from "#/base/command/command.class";
import { InfoCommand } from "#/commnds/global/info/info.class";
import type { Client } from "#/base/client/client.class";

export const globalCommands = (client: Client): Command[] => [
  new InfoCommand(client),
];