import type {
  BaseCommandRunContext,
  CommandRunContext,
  CommandRunResult,
  DmCommandRunContextInfos,
  GuildCommandRunContextInfos,
  MessageCommandRunContext,
  SlashCommandRunContext,
  UserCommandRunContext
} from "#/base/command/command.type";
import { InteractionBase } from "#/base/interaction/interaction.class";
import { CommandError } from "#/utils/error/class/command_error";
import type {
  CommandInteraction,
  Guild,
  GuildBasedChannel,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  MessagePayload
} from "discord.js";
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

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Command<T extends FullCommandDefinition = {}> extends InteractionBase {

  definer: T;

  constructor(client: ArcClient, definer: T) {
    super(client);

    this.definer = definer;
  }


  abstract run(ctx: CommandRunContext<T>): Promise<CommandRunResult>

  /**async handleSubCommands(ctx: CommandRunContext<T>): Promise<CommandRunResult> {
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

   list = this.definer.slash.subCommandsGroups[subCommandGroup];
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

  async reply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionReplyOptions): Promise<CommandRunResult> {
    try {
      await ctx.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: ctx,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async editReply(ctx: BaseCommandRunContext, message: string | MessagePayload | InteractionEditReplyOptions): Promise<CommandRunResult> {
    try {
      await ctx.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        ctx: ctx,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async error(err: CommandError): Promise<CommandRunResult> {
    return error(err);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async ok(value: true | string): Promise<CommandRunResult> {
    return ok(value);
  }

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

      if (hasOption(this.definer.slash)) {
        const [pastedOption, err] = parseOptions(interaction, this.definer.slash.options);

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

}