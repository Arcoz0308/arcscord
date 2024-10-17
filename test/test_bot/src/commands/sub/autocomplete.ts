import { createCommand } from "arcscord";
import { animeList } from "../../utils/test_values";

export const autocompleteSubCommand = createCommand({
  build: {
    name: "autocomplete",
    description: "autocomplete command testing",
    options: {
      anime: {
        description: "Your favorite anime",
        type: "string",
        autocomplete: true,
        required: true,
      },
    },
  },
  run: (ctx) => {
    return ctx.reply({
      ephemeral: true,
      content: `You choice ${ctx.options.anime}`,
    });
  },
  autocomplete: (ctx) => {
    const choices = animeList
      .filter(anime => anime.includes(ctx.focus))
      .slice(0, 25);
    return ctx.sendChoices(choices);
  },
});
