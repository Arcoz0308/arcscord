import { Command } from "#/base/command/command.class";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import {
  commandInteractionToString,
  hasMessageCommand,
  hasSlashCommand,
  hasUserCommand,
  isMessageCommand,
  isSlashCommand,
  isUserCommand,
  parseOptions
} from "#/base/command";
import type {
  ApplicationCommand,
  ApplicationCommandDataResolvable,
  BaseMessageOptions,
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember
} from "discord.js";
import { internalErrorEmbed } from "#/utils/discord/embed/embed.const";
import { BaseManager } from "#/base/manager/manager.class";
import type { DevConfigKey } from "#/manager/dev";
import type {
  CommandResultHandler,
  CommandResultHandlerImplementer,
  CommandResultHandlerInfos
} from "#/manager/command/command_manager.type";
import type { ArcClient } from "#/base";
import { SubCommand } from "#/base";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import type { CommandDefinition } from "#/base/command/command_definition.type";
import { subCommandDefinitionToAPI } from "#/utils/discord/tranformers/command";
import { BaseError } from "@arcscord/better-error";
import {
  DmMessageCommandContext,
  DmSlashCommandContext,
  DmUserCommandContext,
  GuildMessageCommandContext,
  GuildSlashCommandContext,
  GuildUserCommandContext
} from "#/base/command/command_context";
import { CommandError } from "#/utils";

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

  getCommand(interaction: CommandInteraction): Result<{ cmd: Command | SubCommand; resolvedName: string }, BaseError> {
    if (!interaction.command) {
      return error(new BaseError({
        message: `no command object found for interaction with ${interaction.commandName}`,
        debugs: {
          data: interaction.toJSON(),
        },
      }));
    }
    const resolvedCommandName = this.resolveCommandName(interaction.command);
    const command = this.commands.get(resolvedCommandName);

    if (!command) {
      return error(new BaseError({
        message: `no command found with full id ${resolvedCommandName}`,
        debugs: {
          commands: this.commands.keys(),
          command: interaction.command.toJSON(),
        },
      }));
    }

    if (command instanceof Command) {
      return ok({
        cmd: command,
        resolvedName: resolvedCommandName,
      });
    }

    if (!interaction.isChatInputCommand()) {
      return error(new BaseError({
        message: "invalid type get for interaction for handle subCommand",
      }));
    }

    const subCommandName = interaction.options.getSubcommand(false);
    if (!subCommandName) {
      return error(new BaseError({
        message: `missing subCommandName in interaction for command ${command.name}`,
        debugs: {
          data: interaction.options.data,
        },
      }));
    }

    let list = command.subCommands;
    const subCommandGroupName = interaction.options.getSubcommandGroup(false);
    if (subCommandGroupName && command.subCommandsGroups) {
      list = command.subCommandsGroups[subCommandGroupName].subCommands;
    }

    const cmd = list?.find((cmd) => cmd.definer.name === subCommandName);

    if (!cmd) {
      return error(new BaseError({
        message: `no subCommand found for ${subCommandName} subCommand for ${command.name}`,
      }));
    }

    return ok({
      cmd: cmd,
      resolvedName: resolvedCommandName,
    });
  }

  async handleInteraction(interaction: CommandInteraction): Promise<void> {

    /* INITIALISATION */
    const [infos, err] = this.getCommand(interaction);

    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(interaction, internalErrorEmbed(this.client, err.id));
    }

    const command = infos.cmd;

    /* PRECHECK */
    const [next, err2] = await command.preCheck(interaction);
    if (err2) {
      this.logger.logError(err2.generateId());
      return this.sendInternalError(interaction, internalErrorEmbed(this.client, err2.id));
    }

    if (!next) {
      this.logger.trace(`precheck for user ${interaction.user.username} with command ${infos.resolvedName} don't passed`);
      return;
    }

    /* GUILD CHECKS */

    let guildInfos: null | { guild: Guild; member: GuildMember; channel: GuildBasedChannel };

    if (interaction.inGuild()) {
      let guild;
      let member;
      let channel;
      try {
        guild = interaction.inCachedGuild() ? interaction.guild : await this.client.guilds.fetch(interaction.guildId);
      } catch (e) {

        const bError = new BaseError({
          message: `failed to get guild because ${anyToError(e).message}`,
          originalError: anyToError(e),
        }).generateId();

        this.logger.logError(bError);
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      try {
        member = await guild.members.fetch(interaction.user.id);
      } catch (e) {
        const bError = new BaseError({
          message: `failed to get member because ${anyToError(e).message}`,
          originalError: anyToError(e),
        }).generateId();

        this.logger.logError(bError);
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      try {
        channel = interaction.channel ?? await guild.channels.fetch(interaction.channelId);
      } catch (e) {

        const bError = new BaseError({
          message: `failed to get channel because ${anyToError(e).message}`,
          originalError: anyToError(e),
        }).generateId();

        this.logger.logError(bError);
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      if (channel === null) {
        const bError = new BaseError({
          message: `get nul channel value for channel ${interaction.channelId}`,
          debugs: {
            guildId: interaction.guildId,
          },
        }).generateId();

        this.logger.logError(bError);
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      guildInfos = {
        guild: guild,
        member: member,
        channel: channel,
      };

    } else {
      guildInfos = null;
    }

    let context;

    /* Slash Commands */
    if (interaction.isChatInputCommand()) {
      if (command instanceof SubCommand) {
        const [options, err] = command.definer.options
          ? await parseOptions<typeof command.definer.options>(interaction, command.definer.options) : [null, null];

        if (err) {
          this.logger.logError(err.generateId());
          return this.sendInternalError(interaction, internalErrorEmbed(this.client, err.id));
        }

        context = guildInfos
          ? new GuildSlashCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            ...guildInfos,
            // @ts-expect-error fix generic bug
            options: options,
          }) : new DmSlashCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            // @ts-expect-error fix generic bug
            options: options,
          });
      } else if (isSlashCommand(command)) {
        const [options, err] = command.definer.slash.options
          ? await parseOptions<typeof command.definer.slash.options>(interaction, command.definer.slash.options) : [null, null];

        if (err) {
          this.logger.logError(err.generateId());
          return this.sendInternalError(interaction, internalErrorEmbed(this.client, err.id));
        }

        context = guildInfos
          ? new GuildSlashCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            ...guildInfos,
            // @ts-expect-error fix generic bug
            options: options,
          }) : new DmSlashCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            // @ts-expect-error fix generic bug
            options: options,
          });
      } else {
        const bError = new BaseError({
          message: `invalid command, get slash command interaction for command ${infos.resolvedName}`,
        });
        this.logger.logError(bError.generateId());
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      /* User Context Menu Command*/
    } else if (interaction.isUserContextMenuCommand()) {
      if (command instanceof Command && isUserCommand(command)) {
        let targetMember: GuildMember | null = null;
        if (guildInfos && interaction.targetMember) {
          try {
            targetMember = await guildInfos.guild.members.fetch(interaction.targetMember.user.id);
          } catch (e) {
            const bError = new BaseError({
              message: "failed to fetch target member",
              originalError: anyToError(e),
            });
            this.logger.logError(bError.generateId());
            return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
          }
        }

        context = guildInfos
          ? new GuildUserCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            ...guildInfos,
            targetUser: interaction.targetUser,
            targetMember: targetMember,
          }) : new DmUserCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            targetUser: interaction.targetUser,
          });
      } else {
        const bError = new BaseError({
          message: `invalid command, get user command interaction for command ${infos.resolvedName}`,
        });
        this.logger.logError(bError.generateId());
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }

      /* Message Context Menu Command*/
    } else if (interaction.isMessageContextMenuCommand()) {
      if (command instanceof Command && isMessageCommand(command)) {
        context = guildInfos
          ? new GuildMessageCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            ...guildInfos,
            message: interaction.targetMessage,
          }) : new DmMessageCommandContext(command, interaction, {
            resolvedName: infos.resolvedName,
            message: interaction.targetMessage,
          });
      } else {
        const bError = new BaseError({
          message: `invalid command, get user command interaction for command ${infos.resolvedName}`,
        });
        this.logger.logError(bError.generateId());
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
      }
    } else {
      const bError = new BaseError({
        message: `invalid interaction type: ${interaction.type}`,
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(interaction, internalErrorEmbed(this.client, bError.id));
    }

    /* Command Defer */
    if (!context) {
      return;
    }

    if (command.preReply) {
      const [, err3] = await context.deferReply({
        ephemeral: command.preReplyEphemeral,
      });

      if (err3) {
        this.logger.logError(err3.generateId());
        return this.sendInternalError(interaction, internalErrorEmbed(this.client, err3.id));
      }
    }
    /* Command Run */


    const start = Date.now();

    try {
      // @ts-expect-error fix error with never type
      const result = await command.run(context);
      const infos: CommandResultHandlerInfos = {
        result: result,
        interaction: interaction,
        command: command,
        defer: command.preReply,
        start: start,
        end: Date.now(),
      };

      return this._resultHandler(infos);

    } catch (e) {
      const infos: CommandResultHandlerInfos = {
        result: error(new CommandError({
          message: `failed to run command : ${anyToError(e).message}`,
          ctx: context,
          originalError: anyToError(e),
        })),
        interaction: interaction,
        command: command,
        defer: command.preReply,
        start: start,
        end: Date.now(),
      };

      return this._resultHandler(infos);
    }

  }

  async sendInternalError(interaction: CommandInteraction, message: BaseMessageOptions, defer: boolean = false): Promise<void> {
    try {
      if (defer) {
        await interaction.editReply(message);
      } else {
        await interaction.reply({
          ...message,
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
      return this.sendInternalError(infos.interaction, internalErrorEmbed(this.client, err.id), infos.defer);
    }

    this.logger.info(`${infos.interaction.user.username} used command ${commandInteractionToString(infos.interaction)}. Result : `
      + (typeof result === "string" ? result : "success"));
  }


}