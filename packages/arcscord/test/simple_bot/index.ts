import type { Command } from "../../src";
import { ArcClient } from "../../src";
import "dotenv/config";
import { TestCommand } from "./test_command";
import * as process from "node:process";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
  ],
});

client.on("ready", async() => {
  const commands: Command[] = [new TestCommand(client) as Command];
  const body = client.commandManager.loadCommands(commands);
  const data = await client.commandManager.pushGuildCommands(process.env.GUILD_ID as string, body);
  client.commandManager.resolveCommands(commands, data);

});

void client.login();