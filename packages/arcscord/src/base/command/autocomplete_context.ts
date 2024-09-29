import type {
  ArcClient,
  Command,
  CommandRunResult,
  GuildCommandContextBuilderOptions,
  NumberChoices,
  StringChoices,
  SubCommand
} from "#/base";
import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  Guild,
  GuildBasedChannel,
  GuildMember
} from "discord.js";
import { error, ok } from "@arcscord/error";
import { CommandError, type CommandErrorOptions } from "#/utils";

type BaseAutocompleteOptions = {
  resolvedName: string;
}

export class BaseAutocompleteContext {

  client: ArcClient;

  command: Command | SubCommand;

  interaction: AutocompleteInteraction;

  resolvedCommandName: string;

  constructor(command: Command | SubCommand, interaction: AutocompleteInteraction, options: BaseAutocompleteOptions) {
    this.command = command;
    this.client = command.client;
    this.interaction = interaction;
    this.resolvedCommandName = options.resolvedName;
  }

  get focus(): string {
    return this.interaction.options.getFocused(false);
  }

  get fullFocus(): AutocompleteFocusedOption {
    return this.interaction.options.getFocused(true);
  }

  async sendChoices(choices: StringChoices | NumberChoices): Promise<CommandRunResult> {
    try {
      const apiChoices: ApplicationCommandOptionChoiceData[] = [];

      if (Array.isArray(choices)) {
        for (const choice of choices) {
          if (typeof choice === "object") {
            apiChoices.push(choice);
          } else {
            apiChoices.push({
              name: `${choice}`,
              value: choice,
            });
          }
        }
      } else {
        for (const choice of Object.keys(choices)) {
          apiChoices.push({
            name: choice,
            value: choices[choice],
          });
        }
      }

      await this.interaction.respond(apiChoices);
      return ok(true);
    } catch (e) {
      return error(new CommandError({
        message: "Failed to send choices for command",
        ctx: this,
      }));
    }
  }

  ok(value: string | true): CommandRunResult {
    return ok(value);
  }

  error(options: Omit<CommandErrorOptions, "ctx">): CommandRunResult {
    return error(new CommandError({ ...options, ctx: this }));
  }

  async multiple(...funcList: Promise<CommandRunResult>[]): Promise<CommandRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }

}

export class DmAutoCompleteContext extends BaseAutocompleteContext {

  guildId = null;

  guild = null;

  channelId = null;

  channel = null;

  member = null;

  readonly inGuild = false;

  readonly inDM = true;

}

export class GuildAutocompleteContext extends BaseAutocompleteContext {

  guildId: string;

  guild: Guild;

  channelId: string;

  channel: GuildBasedChannel;

  member: GuildMember;

  readonly inGuild = true;

  readonly inDM = false;

  constructor(
    command: Command | SubCommand,
    interaction: AutocompleteInteraction,
    options: GuildCommandContextBuilderOptions & BaseAutocompleteOptions
  ) {
    super(command, interaction, options);

    this.guildId = options.guild.id;
    this.guild = options.guild;
    this.channelId = options.channel.id;
    this.channel = options.channel;
    this.member = options.member;
  }

}

export type AutocompleteContext = GuildAutocompleteContext | DmAutoCompleteContext;