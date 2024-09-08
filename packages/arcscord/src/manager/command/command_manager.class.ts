import { Command } from "#/base/command/command.class";
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
import { anyToError, error } from "@arcscord/error";
import type { CommandDefinition } from "#/base/command/command_definition.type";
import { subCommandDefinitionToAPI } from "#/utils/discord/tranformers/command";

export class CommandManager extends BaseManager implements CommandResultHandlerImplementer {

  commands: Map<string, CommandDefinition> = new Map();

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

  loadCommands(commands: CommandDefinition[], group = "globalCommands"): RESTPostAPIApplicationCommandsJSONBody[] {

    const commandsBody: RESTPostAPIApplicationCommandsJSONBody[] = [];
    let totalCommands = 0;
    let slashCommands = 0;
    let messageCommands = 0;
    let userCommands = 0;


    for (const command of commands) {
      if (command instanceof Command) {
        let hasPush = false;
        const data = command.toAPIObject();

        if (data.slash) {
          commandsBody.push(data.slash);
          slashCommands++;
          hasPush = true;
          this.logger.trace(`loaded slash builder of command "${data.slash.name}" in group "${group}"`);
        }


        if (data.message) {
          commandsBody.push(data.message);
          messageCommands++;
          hasPush = true;
          this.logger.trace(`loaded message builder of command "${data.message.name}" in group "${group}"`);
        }

        if (data.user) {
          commandsBody.push(data.user);
          userCommands++;
          hasPush = true;
          this.logger.trace(`loaded user builder of command "${data.user.name}" in group "${group}"`);

        }
        if (!hasPush) {
          this.logger.fatal(`no builder found for command "${command.constructor.name}" in group "${group}"`, {
            group,
          });
        }
        totalCommands++;
      } else {
        commandsBody.push(subCommandDefinitionToAPI(command));
        slashCommands++;
        this.logger.trace(`loaded slash builder of command "${command.name}" in group "${group}"`);

      }
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


  resolveCommand(command: CommandDefinition, apiCommands: ApplicationCommand[]): void {
    if (command instanceof Command) {

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
    } else {
      const name = command.name;
      const apiCommand = apiCommands.find((cmd) => (
        cmd.type as ApplicationCommandType === ApplicationCommandType.ChatInput
      ) && cmd.name === name);
      if (!apiCommand) {
        this.logger.warning(`slash commands "${name}" not found in API`);
      } else {
        this.logger.trace(`resolve slash command ${name} (${apiCommand.id}) !`);
        this.commands.set(this.resolveCommandName(apiCommand), command);
      }
    }

  }

  resolveCommands(commands: CommandDefinition[], apiCommands: ApplicationCommand[]): void {
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
    let cmd;
    let context;
    let err;

    if (!command) {
      this.logger.error(`no command found with full id ${resolvedCommandName}`, {
        commandsList: this.commands.keys(),
      });
      return;
    }

    if (!(command instanceof Command)) {
      if (!interaction.isChatInputCommand()) {
        this.logger.error(`get subCommand object but interaction object don't match"${command.name}"`, {
          type: interaction.commandType,
          commandList: this.commands.keys(),
        });
        return;
      }

      const subCommandName = interaction.options.getSubcommand(false);
      if (!subCommandName) {
        this.logger.error(`missing subCommandName in interaction for command ${command.name}`, {
          data: interaction.options.data,
        });
        return;
      }

      let list = command.subCommands;
      const subCommandGroupName = interaction.options.getSubcommandGroup(false);
      if (subCommandGroupName && command.subCommandsGroups) {
        list = command.subCommandsGroups[subCommandGroupName].subCommands;
      }

      cmd = list?.find((cmd) => cmd.definer.name === subCommandName);

      if (!cmd) {
        this.logger.error(`no subCommand found for ${subCommandName} subCommand for ${command.name}`);
        return;
      }
      [context, err] = await cmd.buildContext(interaction);

    } else {
      cmd = command;
      [context, err] = await cmd.buildContext(interaction);
    }

    if (!context) {
      this.logger.error(`Get nul context for command ${resolvedCommandName}`);
      return;
    }

    const defer = cmd.preReply;
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(interaction, internalErrorEmbed(err.id));
    }
    const ctx = context;

    const [next, err2] = await cmd.preCheck(interaction);
    if (err2) {
      this.logger.logError(err2);
      return;
    }

    if (!next) {
      this.logger.trace(`precheck for user ${interaction.user.username} with command ${resolvedCommandName} don't passed`);
      return;
    }

    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: cmd.preReplyEphemeral,
        });
      } catch (e) {
        const error = new CommandError({
          message: "failed to pre run defer reply ",
          ctx: ctx,
          debugs: { ephemeral: cmd.preReplyEphemeral },
          originalError: anyToError(e),
        }).generateId();
        this.logger.logError(error);

        return this.sendInternalError(interaction, internalErrorEmbed(error.id));
      }
    }


    const start = Date.now();
    try {

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const result = await cmd.run(ctx);

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

    this.logger.info(`${infos.interaction.user.username} used command ${infos.interaction.command?.name}`
      +  `(${commandTypeToString(infos.interaction.commandType)}). Result : `
      + (typeof result === "string" ? result : "success"));
  }


}