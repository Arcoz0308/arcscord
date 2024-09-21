import type { CommandRunResult } from "#/base/command";
import type { ArcClient } from "#/base/client/client.class";
import type { SubCommandDefinition } from "#/base/command/command_definition.type";
import type { BaseCommandOptions } from "#/base/command/base_command.class";
import { BaseCommand } from "#/base/command/base_command.class";
import type { APIApplicationCommandSubcommandOption } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { optionListToAPI } from "#/utils/discord/tranformers/command";
import type { CommandContext } from "#/base/command/command_context";

export abstract class SubCommand<T extends SubCommandDefinition = SubCommandDefinition> extends BaseCommand {


  definer: T;

  constructor(client: ArcClient, definer: T, options?: BaseCommandOptions) {
    super(client, options);

    this.definer = definer;

  }

  abstract run(ctx: CommandContext<T>): Promise<CommandRunResult>

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