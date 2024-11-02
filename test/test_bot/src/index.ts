import process from "node:process";
import { ArcClient } from "arcscord";
import { Partials } from "discord.js";
import { commands } from "./commands";
import { components } from "./components";
import { messageEvent } from "./event/message";
import en from "./locale/en.json";
import fr from "./locale/fr.json";
import { tasks } from "./task";
import "dotenv/config";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessageReactions",
    "DirectMessageReactions",
    "MessageContent",
  ],
  partials: [Partials.Reaction, Partials.Message, Partials.User],
  autoIntents: true,
  managers: {
    locale: {
      i18nOptions: {
        resources: {
          en: { test: en },
          fr: { test: fr },
        },
        defaultNS: "test",
      },
    },
  },
});

client.loadEvents([messageEvent]);

client.on("ready", async () => {
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
