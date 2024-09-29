import { buildRoleSelectMenu, createSelectMenu } from "#/base/components";
import { EmbedBuilder } from "discord.js";

export const roleSelectMenu = createSelectMenu({
  type: "roleSelect",
  matcher: "role_select_menu",
  build: () => buildRoleSelectMenu({
    placeholder: "Select a role",
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