import type { Client } from "#/base/client/client.class";
import type { Command } from "#/base/command/command.class";
import { Logger } from "#/utils/logger/logger.class";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import { isDev } from "#/utils/config/env";
import { isMessageCommand, isSlashCommand, isUserCommand } from "#/base/command";
import { anyToError } from "#/utils/error/error.util";
import { globalCommands } from "#/manager/command/command_manager.util";

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

  async pushGlobalCommands(commands: RESTPostAPIApplicationCommandsJSONBody[]): Promise<void> {
    const clientId = this.client.user?.id;
    if (!clientId) {
      return this.logger.fatal("no client id found for register global commands");
    }

    const route = Routes.applicationCommands(clientId);

    try {
      await this.client.rest.put(route, {
        body: commands,
      });
    } catch (e) {
      return this.logger.fatal("failed to load commands globally", {
        baseError: anyToError(e).message,
      });
    }

    return this.logger.info(`loaded ${commands.length} commands builders globally with success !`);
  }

  async pushGuildCommands(guildId: string, commands: RESTPostAPIApplicationCommandsJSONBody[]): Promise<void> {
    const clientId = this.client.user?.id;
    if (!clientId) {
      return this.logger.fatal("no client id found for register guild commands");
    }

    const route = Routes.applicationGuildCommands(clientId, guildId);

    try {
      await this.client.rest.put(route, {
        body: commands,
      });
    } catch (e) {
      return this.logger.fatal(`failed to load commands for guild ${guildId}`, {
        baseError: anyToError(e).message,
      });
    }

    return this.logger.info(`loaded ${commands.length} commands builders for guild ${guildId} with success !`);
  }

  isCommandEnableInDev(command: Command): boolean {
    if (command.isEnableInDev) {
      return true;
    }
    return this.client.devManager.isDevEnable(command.name, "commands");
  }

}