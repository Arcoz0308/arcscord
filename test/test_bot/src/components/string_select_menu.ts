import { buildStringSelectMenu, createSelectMenu } from "arcscord";

export const stringSelectMenu = createSelectMenu({
  type: "stringSelect",
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
