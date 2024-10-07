import { buildUserSelectMenu, createSelectMenu } from "arcscord";
import { EmbedBuilder } from "discord.js";

export const userSelectMenu = createSelectMenu({
  type: "userSelect",
  matcher: "user_select_menu",
  build: () =>
    buildUserSelectMenu({
      customId: "user_select_menu",
      minValues: 1,
      maxValues: 25,
    }),
  run: (ctx) => {
    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("User Select")
          .setDescription(
            `Selected :\n-${ctx.values.map(user => user.displayName).join("\n- ")}`,
          ),
      ],
    });
  },
});
