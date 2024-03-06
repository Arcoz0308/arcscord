import { Client as DJSClient } from "discord.js";
import { CommandManager } from "#/manager/command/command_manager.class";
import { DevManager } from "#/manager/dev";

export class Client extends DJSClient {

  commandManager = new CommandManager(this);

  devManager = new DevManager();

}