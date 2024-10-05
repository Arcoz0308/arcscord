import { createCommand } from "#/base/command/command_func";
import { EmbedBuilder } from "discord.js";

export const avatarCommand = createCommand({
  build: {
    slash: {
      name: "avatar",
      description: "test command",
      options: {
        user: {
          type: "user",
          description: "The user",
        },
        size: {
          type: "number",
          description: "yeah",
          choices: [
            64,
            128,
            256,
            512,
            {
              name: "1024 (default)",
              value: 1024,
            },
            2048,
          ],
        } as const,
      },
      integrationTypes: ["userInstall", "guildInstall"],
    },
    user: {
      name: "avatar",
      integrationTypes: ["userInstall", "guildInstall"],
    },
  },
  run: (ctx) => {
    const user = ctx.isSlashCommand
      ? ctx.options.user || ctx.user : ctx.targetUser;

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Avatar de ${user.displayName}`)
          .setImage(user.displayAvatarURL({
            size: ctx.isSlashCommand ? ctx.options.size || 1024 : 1024,
          }) || user.defaultAvatarURL),
      ],
      ephemeral: true,
    });
  },
});