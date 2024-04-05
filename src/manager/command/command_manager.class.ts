import type { Client } from "#/base/client/client.class";
import type { Command } from "#/base/command/command.class";
import { logger, Logger } from "#/utils/logger/logger.class";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import { isDev } from "#/utils/config/env";
import { commandTypeToString, hasPreRun, isMessageCommand, isSlashCommand, isUserCommand } from "#/base/command";
import { anyToError } from "#/utils/error/error.util";
import { globalCommands } from "#/manager/command/command_manager.util";
import type {
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  CommandInteraction,
  EmbedBuilder
} from "discord.js";
import { CommandError } from "#/utils/error/class/command_error.class";
import { internalErrorEmbed } from "#/utils/discord/embed/embed.const";

export class CommandManager {

  commands: Map<string, Command> = new Map();

  logger = new Logger("command");

  constructor(public client: Client) {
  }

  async load(): Promise<void> {
    const commands = globalCommands(this.client);
    const commandsBuilders = this.loadCommands(commands);

    if (isDev) {
      const data = await this.pushGuildCommands(this.client.devManager.config?.config.devGuildId || "no_found", commandsBuilders);
      this.resolveCommands(commands, data);
    } else {
      const data = await this.pushGlobalCommands(commandsBuilders);
      this.resolveCommands(commands, data);
    }

    this.client.on("interactionCreate", (interaction) => {
      if (interaction.isCommand()) {
        void this.handleInteraction(interaction);
      }
    });
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

  async handleInteraction(interaction: CommandInteraction): Promise<void> {
    if (!interaction.command) {
      this.logger.warning(`no command object found for interaction with ${interaction.commandName}`);
      return;
    }

    const resolvedCommandName = this.resolveCommandName(interaction.command);
    const command = this.commands.get(resolvedCommandName);
    if (!command) {
      this.logger.error(`no command found with full id ${resolvedCommandName}`, {
        commandsList: this.commands.keys(),
      });
      return;
    }

    const defer = command.defaultReplyOptions.preReply;

    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: command.defaultReplyOptions.ephemeral,
        });
      } catch (e) {
        const error = new CommandError({
          message: "failed to pre run defer reply ",
          interaction: interaction,
          command: command,
          context: { interaction, defer: false },
          debugs: { ephemeral: command.defaultReplyOptions.ephemeral },
          baseError: anyToError(e),
        }).generateId();
        this.logger.error(error.message, error.getDebugsString());

        return this.sendInternalError(interaction, internalErrorEmbed(error.id));
      }
    }

    let ctx = {
      interaction,
      defer: defer,
    };

    if (hasPreRun(command)) {
      try {
        const [result, err] = await command.preRun(ctx);
        if (err !== null) {
          err.generateId();
          this.logger.error(err.message, err.getDebugsString());
          return this.sendInternalError(interaction, internalErrorEmbed(err.id), defer);
        }

        if (!result) {
          return;
        }

        ctx = result;
      } catch (e) {
        const error = new CommandError({
          message: `failed to pre run command : ${anyToError(e).message}`,
          interaction: interaction,
          command: command,
          context: ctx,
          baseError: anyToError(e),
        }).generateId();
        this.logger.error(error.message, error.getDebugsString());

        return this.sendInternalError(interaction, internalErrorEmbed(error.id), defer);
      }
    }

    try {
      const [result, err] = await command.run(ctx);
      if (err !== null) {
        err.generateId();
        this.logger.error(err.message, err.getDebugsString());
        return this.sendInternalError(interaction, internalErrorEmbed(err.id), defer);
      }

      logger.info(`${interaction.user.username} used command ${command.name}`
        +  `(${commandTypeToString(interaction.commandType)}). Result : `
      + (typeof result === "string" ? result : "success"));

    } catch (e) {
      const error = new CommandError({
        message: `failed to run command : ${anyToError(e).message}`,
        interaction: interaction,
        command: command,
        context: ctx,
        baseError: anyToError(e),
      }).generateId();
      this.logger.error(error.message, error.getDebugsString());

      return this.sendInternalError(interaction, internalErrorEmbed(error.id), defer);
    }
  }

  async sendInternalError(interaction: CommandInteraction, embed: EmbedBuilder, defer: boolean = false): Promise<void> {
    try {
      if (defer) {
        await interaction.editReply({
          embeds: [embed],
        });
      } else {
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    } catch (e) {
      this.logger.error("failed to send internal error message", {
        baseError: anyToError(e).message,
      });
    }
  }

}