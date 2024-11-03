import * as process from "node:process";
import { ArcClient, LocaleManager } from "arcscord";
import handlers from "./_handlers";
import en from "./locale/en.json";

const client = new ArcClient(process.env.TOKEN ?? "", {
  intents: [],
  managers: {
    locale: {
      i18nOptions: {
        resources: {
          en: {
            translations: en,
            arcscord: LocaleManager.arcscordResources.en,
          },
        },
        defaultNS: "translations",
      },
    },
  },
});

client.loadEvents(handlers.events);
client.loadTasks(handlers.tasks);
client.loadComponents(handlers.components);
client.on("ready", async () => {
  void client.loadCommands(handlers.commands);
});

void client.login();
