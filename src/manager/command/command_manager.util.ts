import type { Command } from "#/base/command/command.class";
import { InfoCommand } from "#/commands/global/info/info.class";
import type { Client } from "#/base/client/client.class";
import { UserInfoCommand } from "#/commands/global/user_info/user_info.class";

export const globalCommands = (client: Client): Command[] => [
  new InfoCommand(client),
  new UserInfoCommand(client),
];