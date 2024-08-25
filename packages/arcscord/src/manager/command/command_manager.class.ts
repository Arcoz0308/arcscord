import type { Command } from "#/base/command/command.class";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import { commandTypeToString, hasMessageCommand, hasSlashCommand, hasUserCommand } from "#/base/command";
import type {
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  CommandInteraction,
  EmbedBuilder
} from "discord.js";
import { CommandError } from "#/utils/error/class/command_error";
import { internalErrorEmbed } from "#/utils/discord/embed/embed.const";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import type {
  CommandResultHandler,
  CommandResultHandlerImplementer,
  CommandResultHandlerInfos
} from "#/manager/command/command_manager.type";
import type { ArcClient } from "#/base";
import { BaseError } from "@arcscord/better-error";
import { anyToError, error } from "@arcscord/error";
import { messageDefinerToAPI, slashDefinerToAPI, userDefinerToAPI } from "#/manager/command/definer_to_api.util";

export class CommandManager extends BaseManager implements CommandResultHandlerImplementer {

  commands: Map<string, Command> = new Map();

  name = "command";

  devConfigKey: DevConfigKey = "commands";

  _resultHandler: CommandResultHandler;

  constructor(client: ArcClient) {
    super(client);

    this._resultHandler = (infos: CommandResultHandlerInfos) => {
      return this.resultHandler(infos);
    };

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
      let hasPush = false;
      const definer = command.definer;

      if (hasSlashCommand(definer)) {
        try {
          commandsBody.push(slashDefinerToAPI(definer.slash));
          slashCommands++;
          hasPush = true;
          this.logger.trace(`loaded slash builder of command "${command.name} in group ${group}"`);

        } catch (e) {
          return this.logger.fatalError(new BaseError({
            message: `invalid slash builder of slash command "${command.name}"`,
            originalError: anyToError(e),
            debugs: {
              group: group,
            },
          }));
        }
      }

      if (hasMessageCommand(definer)) {
        try {
          commandsBody.push(messageDefinerToAPI(definer.message));
          messageCommands++;
          hasPush = true;
          this.logger.trace(`loaded message builder of command "${command.name}" in group ${group}`);

        } catch (e) {
          return this.logger.fatalError(new BaseError({
            message: `invalid message builder for message command ${command.name}`,
            originalError: anyToError(e),
            debugs: {
              group: group,
            },
          }));
        }
      }

      if (hasUserCommand(definer)) {
        try {
          commandsBody.push(userDefinerToAPI(definer.user));
          userCommands++;
          hasPush = true;
          this.logger.trace(`loaded user builder of command "${command.name}" in group ${group}`);

        } catch (e) {
          return this.logger.fatalError(new BaseError({
            message: `invalid user builder for user command ${command.name}`,
            originalError: anyToError(e),
            debugs: {
              group: group,
            },
          }));
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

  resolveCommand(command: Command, apiCommands: ApplicationCommand[]): void {
    if (hasSlashCommand(command.definer)) {
      const name = command.definer.slash.name;
      const apiCommand = apiCommands.find((cmd) => (
          cmd.type as ApplicationCommandType === ApplicationCommandType.ChatInput)
        && cmd.name === name);

      if (!apiCommand) {
        this.logger.warning(`slash command "${command.definer.slash.name}" not found in API`);
      } else {
        this.logger.trace(`resolve slash command ${command.definer.slash.name} (${apiCommand.id}) !`);
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }

    if (hasMessageCommand(command.definer)) {
      const name = command.definer.message.name;
      const apiCommand = apiCommands.find((cmd) => (
          cmd.type as ApplicationCommandType === ApplicationCommandType.Message)
        && cmd.name === name);

      if (!apiCommand) {
        this.logger.warning(`message command "${command.definer.message.name}" not found in API`);
      } else {
        this.logger.trace(`resolve message command ${command.definer.message.name} (${apiCommand.id}) !`);
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }

    if (hasUserCommand(command.definer)) {
      const name = command.definer.user.name;
      const apiCommand = apiCommands.find((cmd) => (
          cmd.type as ApplicationCommandType === ApplicationCommandType.User)
        && cmd.name === name);

      if (!apiCommand) {
        this.logger.warning(`user command "${command.definer.user.name}" not found in API`);
      } else {
        this.logger.trace(`resolve user command ${command.definer.user.name} (${apiCommand.id}) !`);
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }
  }

  resolveCommands(commands: Command[], apiCommands: ApplicationCommand[]): void {
    for (const command of commands) {
      this.resolveCommand(command, apiCommands);
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
    const [context, err] = await command.buildContext(interaction);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(interaction, internalErrorEmbed(err.id));
    }
    const ctx = context;

    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: command.defaultReplyOptions.ephemeral,
        });
      } catch (e) {
        const error = new CommandError({
          message: "failed to pre run defer reply ",
          ctx: ctx,
          debugs: { ephemeral: command.defaultReplyOptions.ephemeral },
          originalError: anyToError(e),
        }).generateId();
        this.logger.logError(error);

        return this.sendInternalError(interaction, internalErrorEmbed(error.id));
      }
    }


    const start = Date.now();
    try {

      const result = await command.run(ctx);

      const infos: CommandResultHandlerInfos = {
        result: result,
        interaction: interaction,
        command: command,
        defer: defer,
        start: start,
        end: Date.now(),
      };

      return this._resultHandler(infos);

    } catch (e) {
      const infos: CommandResultHandlerInfos = {
        result: error(new CommandError({
          message: `failed to run command : ${anyToError(e).message}`,
          ctx: ctx,
          originalError: anyToError(e),
        })),
        interaction: interaction,
        command: command,
        defer: defer,
        start: start,
        end: Date.now(),
      };

      return this._resultHandler(infos);
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

  async resultHandler(infos: CommandResultHandlerInfos): Promise<void> {
    const [result, err] = infos.result;
    if (err !== null) {
      err.generateId();
      this.logger.logError(err);
      return this.sendInternalError(infos.interaction, internalErrorEmbed(err.id), infos.defer);
    }

    this.logger.info(`${infos.interaction.user.username} used command ${infos.command.name}`
      +  `(${commandTypeToString(infos.interaction.commandType)}). Result : `
      + (typeof result === "string" ? result : "success"));
  }


}