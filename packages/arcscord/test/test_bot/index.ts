import { ArcClient } from "#/base";
import { commands } from "./commands";
import "dotenv/config";
import process from "node:process";
import { messageEvent } from "./event/message";
import { Partials } from "discord.js";
import { components } from "./components";
import { tasks } from "./task";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessageReactions",
    "DirectMessageReactions",
    "MessageContent",
    "GuildMessages",
  ],
  partials: [
    Partials.Reaction,
    Partials.Message,
    Partials.User,
  ],
});

client.loadEvents([
  messageEvent,
]);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {
  await client.loadCommands(commands);
  client.loadComponents(components);
  client.loadTasks(tasks);
  const [count, err] = await client.commandManager.deleteUnloadedCommands();
  if (err) {
    return client.logger.fatalError(err);
  }
  client.logger.info(`Deleted ${count} unloaded commands`);
});

void client.login();