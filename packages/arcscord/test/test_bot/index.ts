import { ArcClient } from "#/base";
import { commands } from "./commands";
import "dotenv/config";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
  ],
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {
  void client.loadCommands(commands(client));
});

void client.login();