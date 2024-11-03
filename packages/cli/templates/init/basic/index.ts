import * as process from "node:process";
import { ArcClient } from "arcscord";
import handlers from "./_handlers";

const client = new ArcClient(process.env.TOKEN ?? "", {
  intents: [],
});

client.loadEvents(handlers.events);
client.loadTasks(handlers.tasks);
client.loadComponents(handlers.components);
client.on("ready", async () => {
  void client.loadCommands(handlers.commands);
});

void client.login();
