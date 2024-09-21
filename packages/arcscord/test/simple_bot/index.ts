import { ArcClient } from "../../src";
import "dotenv/config";
import { TestCommand } from "./test_command";
import * as process from "node:process";
import type { CommandDefinition } from "#/base/command/command_definition.type";
import { Ping } from "./test_sub_command";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
  ],
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {
  const commands: CommandDefinition[] = [
    new TestCommand(client),
    {
      name: "test",
      description: "test",
      subCommandsGroups: {
        one: {
          description: "one",
          subCommands: [
            new Ping(client),
          ],
        },
      },
    },

  ];
  const body = client.commandManager.loadCommands(commands);
  const data = await client.commandManager.pushGuildCommands(process.env.GUILD_ID as string, body);
  client.commandManager.resolveCommands(commands, data);

});

void client.login();