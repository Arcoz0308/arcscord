import { Client as DJSClient, IntentsBitField, REST } from "discord.js";
import { CommandManager } from "#/manager/command/command_manager.class";
import { DevManager } from "#/manager/dev";
import { logger } from "#/utils/logger/logger.class";
import { EventManager } from "#/manager/event/event_manager.class";

export class Client extends DJSClient {

  commandManager = new CommandManager(this);

  devManager = new DevManager();

  eventManager = new EventManager(this);

  logger = logger;

  rest: REST;

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
      this.logger.info("bot connected...");
      void this.commandManager.load();
    });
  }

  async preLoad(): Promise<void> {
    this.eventManager.load();
  }

}