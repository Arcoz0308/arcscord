import type {
  ArcClient,
  CommandHandler,
  CommandRunResult,
  NumberChoices,
  StringChoices,
} from "#/base";
import type { ContextDocs } from "#/base/utils/context.type";
import type { CommandErrorOptions } from "#/utils";
import type {
  ApplicationCommandOptionChoiceData,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  TextBasedChannel,
  User,
} from "discord.js";
import type { APIInteractionGuildMember } from "discord-api-types/v10";
import type i18next from "i18next";
import { CommandError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";

type BaseAutocompleteOptions = {
  resolvedName: string;
  client: ArcClient;
  locale: string;
};

/**
 * Base class for handling autocomplete context.
 */
export class AutocompleteContext<InGuild extends true | false = true | false> implements ContextDocs {
  client: ArcClient;

  command: CommandHandler;

  interaction: AutocompleteInteraction;

  resolvedCommandName: string;

  user: User;

  guild: InGuild extends true ? Guild : null;

  guildId: InGuild extends true ? string : null;

  member: InGuild extends true ? GuildMember | APIInteractionGuildMember : null;

  channel: InGuild extends true ? GuildTextBasedChannel | TextBasedChannel : null;

  channelId: InGuild extends true ? string : null;

  /**
   * get a locale text, with language detected self
   */
  t: typeof i18next.t;

  /**
   * Constructs a new BaseAutocompleteContext.
   *
   * @param command - The command props.
   * @param interaction - The autocomplete interaction.
   * @param options - The base autocomplete options.
   */
  constructor(
    command: CommandHandler,
    interaction: AutocompleteInteraction,
    options: BaseAutocompleteOptions,
  ) {
    this.command = command;
    this.interaction = interaction;
    this.resolvedCommandName = options.resolvedName;
    this.client = options.client;
    this.user = interaction.user;
    this.t = this.client.localeManager.i18n.getFixedT(options.locale);

    this.guild = interaction.guild as InGuild extends true ? Guild : null;
    this.member = interaction.member as InGuild extends true ? GuildMember | APIInteractionGuildMember : null;
    this.guildId = interaction.guildId as InGuild extends true ? string : null;
    this.channel = interaction.channel as InGuild extends true ? GuildTextBasedChannel | TextBasedChannel : null;
    this.channelId = interaction.channelId as InGuild extends true ? string : null;
  }

  /**
   * Gets the focused option's value as a string.
   */
  get focus(): string {
    return this.interaction.options.getFocused(false);
  }

  /**
   * Gets the full focused option.
   */
  get fullFocus(): AutocompleteFocusedOption {
    return this.interaction.options.getFocused(true);
  }

  /**
   * Sends choices to the interaction.
   *
   * @param choices - The choices to send.
   * @returns A promise that resolves to CommandRunResult.
   */
  async sendChoices(
    choices: StringChoices | NumberChoices,
  ): Promise<CommandRunResult> {
    try {
      const apiChoices: ApplicationCommandOptionChoiceData[] = [];

      if (Array.isArray(choices)) {
        for (const choice of choices) {
          if (typeof choice === "object") {
            if (typeof choice.nameLocalizations === "function") {
              const nameLocalization = choice.nameLocalizations(this.t);
              apiChoices.push({ ...choice, nameLocalizations: {
                [this.interaction.locale]: nameLocalization,
              } });
            }
            else {
              apiChoices.push(choice as ApplicationCommandOptionChoiceData);
            }
          }
          else {
            apiChoices.push({
              name: `${choice}`,
              value: choice,
            });
          }
        }
      }
      else {
        for (const choice of Object.keys(choices)) {
          apiChoices.push({
            name: choice,
            value: choices[choice],
          });
        }
      }

      await this.interaction.respond(apiChoices);
      return ok(true);
    }
    catch (e) {
      return error(
        new CommandError({
          message: `Failed to send choices for command, error : ${anyToError(e).message}`,
          ctx: this,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Returns a successfully CommandRunResult
   *
   * @param value A value to pass to the command. Can be a string or true.
   */
  ok(value: string | true = true): CommandRunResult {
    return ok(value);
  }

  /**
   * return a failed CommandRunResult
   *
   * @param options - The options for creating the CommandError, excluding the context (`ctx`).
   */
  error(options: Omit<CommandErrorOptions, "ctx">): CommandRunResult {
    return error(new CommandError({ ...options, ctx: this }));
  }

  /**
   * Executes multiple functions in sequence, returning an error if any fail.
   *
   * @param funcList - The list of functions to execute.
   * @returns A promise that resolves to CommandRunResult.
   */
  async multiple(
    ...funcList: Promise<CommandRunResult>[]
  ): Promise<CommandRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }
}
