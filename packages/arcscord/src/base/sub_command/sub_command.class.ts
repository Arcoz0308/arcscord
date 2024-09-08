import type {
  CommandRunResult,
  DmCommandRunContextInfos,
  GuildCommandRunContextInfos,
  SubCommandRunContext
} from "#/base/command";
import { parseOptions, type SlashCommandRunContext } from "#/base/command";
import type { ArcClient } from "#/base/client/client.class";
import type {
  PartialCommandDefinitionForSlash,
  SlashOptionsCommandDefinition,
  SubCommandDefinition
} from "#/base/command/command_definition.type";
import type { BaseCommandOptions } from "#/base/command/base_command.class";
import { BaseCommand } from "#/base/command/base_command.class";
import type { ChatInputCommandInteraction } from "discord.js";
import { type Guild, type GuildBasedChannel, GuildMember } from "discord.js";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";
import { CommandError } from "#/utils";
import type { APIApplicationCommandSubcommandOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { optionListToAPI } from "#/utils/discord/tranformers/command";

export abstract class SubCommand<T extends SubCommandDefinition = SubCommandDefinition> extends BaseCommand {


  definer: T;

  constructor(client: ArcClient, definer: T, options?: BaseCommandOptions) {
    super(client, options);

    this.definer = definer;

  }

  abstract run(ctx: SubCommandRunContext<T>): Promise<CommandRunResult>


  async buildContext(interaction: ChatInputCommandInteraction): Promise<Result<SubCommandRunContext<T>, BaseError>> {

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

    let options;

    if (this.definer.options) {
      const [pastedOption, err] = await parseOptions(interaction, this.definer.options);

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

    const ctx: SubCommandRunContext<T> = {
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

  toAPIObject(): APIApplicationCommandSubcommandOption {
    return {
      type: ApplicationCommandOptionType.Subcommand,
      name: this.definer.name,
      description: this.definer.description,
      name_localizations: this.definer.nameLocalizations,
      description_localizations: this.definer.descriptionLocalizations,
      options: this.definer.options ? optionListToAPI(this.definer.options) : undefined,
    };
  }

}