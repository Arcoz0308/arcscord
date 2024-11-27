import { buildStringSelectMenu, createSelectMenu } from "arcscord";
import { ComponentType } from "discord.js";

export const stringSelectMenu = createSelectMenu({
  type: ComponentType.StringSelect,
  matcher: "string_select_menu",
  build: (...options) =>
    buildStringSelectMenu({
      options,
      customId: "string_select_menu",
    }),
  run: (ctx) => {
    return ctx.reply(`Selected ${ctx.values.join(", ")} !`);
  },
});
