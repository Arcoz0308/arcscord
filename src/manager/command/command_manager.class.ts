import type { Client } from "#/base/client/client.class";
import type { Command } from "#/base/command/command.class";
import { Logger } from "#/utils/logger/logger.class";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import { isDev } from "#/utils/config/env";
import { isMessageCommand, isSlashCommand, isUserCommand } from "#/base/command";
import { anyToError } from "#/utils/error/error.util";
import { globalCommands } from "#/manager/command/command_manager.util";
import type { ApplicationCommand, ApplicationCommandDataResolvable } from "discord.js";

export class CommandManager {

  commands: Map<string, Command> = new Map();

  logger = new Logger("command");

  constructor(public client: Client) {
  }

  async load(): Promise<void> {
    const commands = this.loadCommands(globalCommands);

    if (isDev) {
      await this.pushGuildCommands(this.client.devManager.config?.config.devGuildId || "no_found", commands);
    } else {
      await this.pushGlobalCommands(commands);
    }
  }

  loadCommands(commands: Command[], group = "globalCommands"): RESTPostAPIApplicationCommandsJSONBody[] {

    const commandsBody: RESTPostAPIApplicationCommandsJSONBody[] = [];
    let totalCommands = 0;
    let slashCommands = 0;
    let messageCommands = 0;
    let userCommands = 0;


    for (const command of commands) {
      if (isDev && !this.isCommandEnableInDev(command)) {
        this.logger.trace(`skip loading command "${command.name}" (no enable in dev) in group ${group}`);
        continue;
      }
      let hasPush = false;

      if (isSlashCommand(command)) {
        try {
          commandsBody.push(command.slashBuilder.toJSON());
          slashCommands++;
          hasPush = true;
          this.logger.trace(`loaded slash builder of command "${command.name} in group ${group}"`);

        } catch (e) {
          return this.logger.fatal(`invalid infos in builder for slash command "${command.name}"`,
            {
              baseError: anyToError(e).message,
              group,
            });
        }
      }

      if (isMessageCommand(command)) {
        try {
          commandsBody.push(command.messageBuilder.toJSON());
          messageCommands++;
          hasPush = true;
          this.logger.trace(`loaded message builder of command "${command.name}" in group ${group}`);

        } catch (e) {
          return this.logger.fatal(`invalid infos in builder for message command "${command.name}"`,
            {
              baseError: anyToError(e).message,
              group,
            });
        }
      }

      if (isUserCommand(command)) {
        try {
          commandsBody.push(command.userBuilder.toJSON());
          userCommands++;
          hasPush = true;
          this.logger.trace(`loaded user builder of command "${command.name}" in group ${group}`);

        } catch (e) {
          return this.logger.fatal(`invalid infos in builder for user command "${command.name}"`,
            {
              baseError: anyToError(e).message,
              group,
            });
        }
      }
      if (!hasPush) {
        this.logger.fatal(`no builder found for command "${command.name}"`, {
          group,
        });
      }
      totalCommands++;
    }

    this.logger.info(`loaded ${totalCommands} commands for group ${group} ! (${slashCommands} slash`
      + `, ${messageCommands} message, ${userCommands} user)`);

    return commandsBody;
  }

  async pushGlobalCommands(commands: ApplicationCommandDataResolvable[]): Promise<ApplicationCommand[]> {

    if (!this.client.application) {
      return this.logger.fatal("no application found !");
    }

    try {

      const data = await this.client.application.commands.set(commands);
      this.logger.info(`loaded ${commands.length} commands builders globally with success !`);
      return data.map((cmd) => cmd);
    } catch (e) {
      return this.logger.fatal("failed to load commands globally", {
        baseError: anyToError(e).message,
      });
    }

  }

  async pushGuildCommands(guildId: string, commands: RESTPostAPIApplicationCommandsJSONBody[]): Promise<ApplicationCommand[]> {

    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      return this.logger.fatal(`guild ${guildId} not found`);
    }

    try {
      const data = await guild.commands.set(commands);
      this.logger.info(`loaded ${commands.length} commands builders for guild ${guildId} with success !`);
      return data.map((cmd) => cmd);
    } catch (e) {
      return this.logger.fatal(`failed to load commands for guild ${guildId}`, {
        baseError: anyToError(e).message,
      });
    }
  }

  isCommandEnableInDev(command: Command): boolean {
    if (command.isEnableInDev) {
      return true;
    }
    return this.client.devManager.isDevEnable(command.name, "commands");
  }

  resolveCommand(command: Command, apiCommands: ApplicationCommand[]): void {

    //as are here for eslint fix
    if (isSlashCommand(command)) {
      const apiCommand = apiCommands.find((cmd) => cmd.type as ApplicationCommandType === ApplicationCommandType.ChatInput);
      if (!apiCommand) {
        this.logger.warning(`slash command "${command.name}" not found in API`);
      } else {
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }

    if (isMessageCommand(command)) {
      const apiCommand = apiCommands.find((cmd) => cmd.type as ApplicationCommandType === ApplicationCommandType.Message);
      if (!apiCommand) {
        this.logger.warning(`message command "${command.name}" not found in API`);
      } else {
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }

    if (isUserCommand(command)) {
      const apiCommand = apiCommands.find((cmd) => cmd.type as ApplicationCommandType === ApplicationCommandType.User);
      if (!apiCommand) {
        this.logger.warning(`user command "${command.name}" not found in API`);
      } else {
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }
  }

  resolveCommands(commands: Command[], apiCommands: ApplicationCommand[]): void {
    for (const command of commands) {
      this.resolveCommand(command, apiCommands.filter((cmd) => cmd.name === command.name));
    }
  }

  resolveCommandName(apiCommand: ApplicationCommand): string {
    if (apiCommand.guildId) {
      return "g_" + apiCommand.id + "_" + apiCommand.name;
    }
    return apiCommand.id + "_" + apiCommand.name;
  }

}