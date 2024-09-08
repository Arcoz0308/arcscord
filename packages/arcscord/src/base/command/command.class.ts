import type {
  APICommandObject,
  CommandRunContext,
  CommandRunResult,
  DmCommandRunContextInfos,
  GuildCommandRunContextInfos,
  MessageCommandRunContext,
  SlashCommandRunContext,
  UserCommandRunContext
} from "#/base/command/command.type";
import { CommandError } from "#/utils/error/class/command_error";
import type { CommandInteraction, Guild, GuildBasedChannel } from "discord.js";
import { GuildMember } from "discord.js";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";
import type {
  FullCommandDefinition,
  PartialCommandDefinitionForSlash,
  SlashOptionsCommandDefinition
} from "#/base/command/command_definition.type";
import type { ArcClient } from "#/base";
import { hasMessageCommand, hasOption, hasUserCommand, parseOptions } from "#/base";
import type { BaseCommandOptions } from "#/base/command/base_command.class";
import { BaseCommand } from "#/base/command/base_command.class";
import { contextsToAPI, integrationTypeToAPI, optionListToAPI } from "#/utils/discord/tranformers/command";
import { ApplicationCommandType } from "discord-api-types/v10";
import { permissionToAPI } from "#/utils/discord/tranformers/permission";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Command<T extends FullCommandDefinition = FullCommandDefinition> extends BaseCommand {

  definer: T;

  constructor(client: ArcClient, definer: T, options?: BaseCommandOptions) {
    super(client, options);

    this.definer = definer;
  }


  abstract run(ctx: CommandRunContext<T>): Promise<CommandRunResult>

  /* async handleSubCommands(ctx: BaseCommandRunContext): Promise<CommandRunResult> {
    if (!this.definer.slash || !hasSubCommands(this.definer.slash)) {
      return error(new CommandError({
        message: "invalid command for handle subCommands !",
        ctx: ctx,
      }));
    }

    if (ctx.type !== "slash" || !ctx.interaction.isChatInputCommand()) {
      return error(new CommandError({
        message: "get interaction for no slash command interaction",
        ctx: ctx,
      }));
    }

    let list: SubCommand[] = this.definer.slash.subCommands  || [];

    const subCommandGroup = ctx.interaction.options.getSubcommandGroup(false);
    if (subCommandGroup) {
      if (!this.definer.slash.subCommandsGroups
   || Object.keys(this.definer.slash.subCommandsGroups).includes(subCommandGroup)) {
        return error(new CommandError({
          message: `subCommand group ${subCommandGroup} not found`,
          ctx: ctx,
          debugs: { subs: JSON.stringify(Object.keys(list)) },
        }));
      }

      list = this.definer.slash.subCommandsGroups[subCommandGroup].subCommands;
    }


    const subCommandName = ctx.interaction.options.getSubcommand(false);
    if (!subCommandName) {
      return error(new CommandError({
        message: "subCommand not found",
        ctx: ctx,
        debugs: { subs: JSON.stringify(Object.keys(list)) },
      }));
    }

    const subCommand = list.find((sub) => sub.definer.name === subCommandName);

    if (!subCommand) {
      return error(new CommandError({
        message: `subCommand ${subCommandName} not found`,
        ctx: ctx,
        debugs: { subs: JSON.stringify(Object.keys(list)) },
      }));
    }

    return subCommand.run(ctx);
  } */


  async buildContext(interaction: CommandInteraction): Promise<Result<CommandRunContext<T>, BaseError>> {
    let guildObject: GuildCommandRunContextInfos | DmCommandRunContextInfos;

    if (interaction.inGuild()) {
      let guild: Guild;

      try {
        guild = interaction.inCachedGuild() ? interaction.guild : await this.client.guilds.fetch(interaction.guildId);
      } catch (e) {
        return error(new BaseError({
          message: "Failed to get guild object for CommandRunContext Build",
          originalError: anyToError(e),
        }));
      }

      let member: GuildMember;
      try {
        member = interaction.member instanceof GuildMember ? interaction.member : await guild.members.fetch(interaction.user.id);
      } catch (e) {
        return error(new BaseError({
          message: "Failed to get member for CommandRunContext Build",
          originalError: anyToError(e),
        }));
      }

      let channel: GuildBasedChannel;

      try {
        const channelFetch = interaction.channel !== null ? interaction.channel : await guild.channels.fetch(interaction.channelId);

        if (!channelFetch) {
          return error(new BaseError({
            message: "Failed to get channel for CommandRunContext Build, receive null value",
            debugs: {
              channelId: interaction.channelId,
              guildId: guild.id,
            },
          }));
        }

        channel = channelFetch;
      } catch (e) {
        return error(new BaseError({
          message: "Failed to get channel for CommandRunContext Build",
          originalError: anyToError(e),
        }));
      }

      guildObject = {
        guild: guild,
        member: member,
        channel: channel,
        inGuild: true,
      };
    } else {
      guildObject = {
        guild: null,
        member: null,
        channel: null,
        inGuild: false,
      };
    }

    if (interaction.isChatInputCommand() && this.definer.slash) {

      let options;

      if (hasOption(this.definer.slash) && this.definer.slash.options) {
        const [pastedOption, err] = await parseOptions(interaction, this.definer.slash.options);

        if (err) {
          return error(err);
        }
        options = pastedOption;
      } else {
        options = undefined;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const baseCtx: Omit<SlashCommandRunContext<
        T extends PartialCommandDefinitionForSlash ?
          (T["slash"] extends SlashOptionsCommandDefinition ? T["slash"]["options"] : undefined) : undefined
      >, "reply" | "editReply" | "ok" | "error"> = {
        interaction: interaction,
        type: "slash",
        isSlashCommand: true,
        isUSerCommand: false,
        isMessageCommand: false,
        defer: false,
        command: this,
        user: interaction.user,
        options: options,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const ctx: CommandRunContext<T> = {
        ...baseCtx,
        ...guildObject,
        reply: (msg) => {
          return this.reply(ctx, msg);
        },
        editReply: (msg) => {
          return this.editReply(ctx, msg);
        },
        ok: (value) => {
          return this.ok(value);
        },
        error: (options) => {
          if (typeof options === "string") {
            return this.error(new CommandError({
              ctx: ctx,
              message: options,
            }));
          }

          return this.error(new CommandError({
            ctx: ctx,
            ...options,
          }));
        },
      };

      return ok(ctx);
    }


    if (interaction.isMessageContextMenuCommand() && hasMessageCommand(this.definer)) {
      const baseCtx: Omit<MessageCommandRunContext, "reply" | "editReply" | "ok" | "error"> = {
        interaction: interaction,
        type: "message",
        isSlashCommand: false,
        isUSerCommand: false,
        isMessageCommand: true,
        defer: false,
        command: this,
        user: interaction.user,
        targetMessage: interaction.targetMessage,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const ctx: CommandRunContext<T> = {
        ...guildObject,
        ...baseCtx,
        reply: (msg) => {
          return this.reply(ctx, msg);
        },
        editReply: (msg) => {
          return this.editReply(ctx, msg);
        },
        ok: (value) => {
          return this.ok(value);
        },
        error: (options) => {
          if (typeof options === "string") {
            return this.error(new CommandError({
              ctx: ctx,
              message: options,
            }));
          }

          return this.error(new CommandError({
            ctx: ctx,
            ...options,
          }));
        },
      };

      return ok(ctx);
    }

    if (interaction.isUserContextMenuCommand() && hasUserCommand(this.definer)) {
      let targetMember: GuildMember | null;

      try {
        if (guildObject.inGuild) {
          targetMember = interaction.targetMember instanceof GuildMember
            ? interaction.targetMember
            : (await guildObject.guild.members.fetch(interaction.targetId));
        } else {
          targetMember = null;
        }
      } catch (e) {
        this.client.logger.trace(`Failed to fetch member with id ${interaction.targetId}`
          + `for user command context, error : ${anyToError(e).message}`);
        targetMember = null;
      }

      const baseCtx: Omit<UserCommandRunContext, "reply" | "editReply" | "ok" | "error"> = {
        interaction: interaction,
        type: "user",
        isSlashCommand: false,
        isUSerCommand: true,
        isMessageCommand: false,
        defer: false,
        command: this,
        user: interaction.user,
        targetUser: interaction.targetUser,
        targetMember: targetMember,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const ctx: CommandRunContext<T> = {
        ...guildObject,
        ...baseCtx,
        reply: (msg) => {
          return this.reply(ctx, msg);
        },
        editReply: (msg) => {
          return this.editReply(ctx, msg);
        },
        ok: (value) => {
          return this.ok(value);
        },
        error: (options) => {
          if (typeof options === "string") {
            return this.error(new CommandError({
              ctx: ctx,
              message: options,
            }));
          }

          return this.error(new CommandError({
            ctx: ctx,
            ...options,
          }));
        },
      };

      return ok(ctx);
    }

    return error(new BaseError({
      message: "don't get type of user, slash of message command",
      debugs: {
        commandType: interaction.commandType,
      },
    }));
  }

  toAPIObject(): APICommandObject {
    const obj: APICommandObject = {};

    if (this.definer.slash) {
      const def = this.definer.slash;

      obj.slash = {
        type: ApplicationCommandType.ChatInput,
        name: def.name,
        description: def.description,
        name_localizations: def.nameLocalizations,
        description_localizations: def.descriptionLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
        options: def.options ? optionListToAPI(def.options) : undefined,
      };
    }

    if (this.definer.user) {
      const def = this.definer.user;

      obj.user = {
        type: ApplicationCommandType.User,
        name: def.name,
        name_localizations: def.nameLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
      };
    }

    if (this.definer.message) {
      const def = this.definer.message;

      obj.message = {
        type: ApplicationCommandType.Message,
        name: def.name,
        name_localizations: def.nameLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
      };
    }

    return obj;
  }

}