import { buildMentionableSelectMenu, createSelectMenu } from "arcscord";
import { User } from "discord.js";

export const mentionableSelectMenu = createSelectMenu({
  type: "mentionableSelect",
  matcher: "mentionable_select_menu",
  build: () =>
    buildMentionableSelectMenu({
      customId: "mentionable_select_menu",
    }),
  run: (ctx) => {
    const value = ctx.values[0];
    if (value instanceof User) {
      return ctx.reply("Select a user");
    }
    else {
      return ctx.reply("select a role");
    }
  },
});
