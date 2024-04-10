import { Client as DJSClient, IntentsBitField, REST } from "discord.js";
import { CommandManager } from "#/manager/command/command_manager.class";
import { DevManager } from "#/manager/dev";
import { logger } from "#/utils/logger/logger.class";
import { EventManager } from "#/manager/event/event_manager.class";
import { TaskManager } from "#/manager/task/task_manager";

export class Client extends DJSClient {

  commandManager = new CommandManager(this);

  devManager = new DevManager();

  eventManager = new EventManager(this);

  taskManager = new TaskManager(this);

  logger = logger;

  rest: REST;

  ready = false;

  constructor(token: string) {
    super({
      intents: [
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
      ],
    });

    this.token = token;

    this.rest = new REST({
      version: "10",
    }).setToken(token);

    this.on("ready", () => {
      this.ready = true;
      this.logger.info("bot connected...");
      void this.commandManager.load();
    });
  }

  async preLoad(): Promise<void> {
    this.eventManager.load();
    this.taskManager.load();
  }

  waitReady(delay = 500): Promise<void> {
    return new Promise((resolve) => {
      if (this.ready) {
        return resolve();
      }

      setTimeout(() => {
        if (this.ready) {
          return resolve();
        }

        // delay : 0.5s, 1s, 2s, 4s, 8s, 5s, 10s and repeat infinity last two
        return this.waitReady(delay <= 5000 ? delay * 2 : 5000);

      }, delay);

    });
  }

}