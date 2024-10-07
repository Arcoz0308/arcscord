import { buildRoleSelectMenu, createSelectMenu } from "arcscord";
import { EmbedBuilder } from "discord.js";

export const roleSelectMenu = createSelectMenu({
  type: "roleSelect",
  matcher: "role_select_menu",
  build: (placeHolder) =>
    buildRoleSelectMenu({
      placeholder: placeHolder,
      customId: "role_select_menu",
      maxValues: 1,
      minValues: 1,
    }),
  run: (ctx) => {
    const role = ctx.values[0];

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Info about role ${role.name}`)
          .setDescription(`Position: ${role.position}\nColor: ${role.color}`)
          .setColor(role.color),
      ],
    });
  },
});
