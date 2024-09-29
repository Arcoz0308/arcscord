import type { ArcClient, AutocompleteCommand, CommandContext, CommandRunResult, FullCommandDefinition } from "#/base";
import { Command } from "#/base";
import type { AutocompleteContext } from "#/base/command/autocomplete_context";
import { animeList } from "../utils/test_values";


const definer = {
  slash: {
    name: "autocomplete",
    description: "Autocomplete command testing",
    options: {
      anime: {
        description: "Your favorite anime",
        type: "string",
        autocomplete: true,
        required: true,
      },
    },
  },
} as const satisfies FullCommandDefinition;

export class AutocompleteTestCommand extends Command implements AutocompleteCommand {

  constructor(client: ArcClient) {
    super(client, definer);
  }

  autocomplete(ctx: AutocompleteContext): Promise<CommandRunResult> {
    const choices = animeList.filter((anime) => anime.includes(ctx.focus)).slice(0, 25);
    return ctx.sendChoices(choices);
  }

  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {
    return ctx.reply({
      ephemeral: true,
      content: `You choice ${ctx.options.anime}`,
    });
  }

}