import type { FullCommandDefinition } from "#/base/command/command_definition.type";
import { type ArcClient, Command, type CommandRunResult } from "#/base";
import { EmbedBuilder } from "discord.js";
import type { CommandContext } from "#/base/command/command_context";

const definer = {
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
      },
    },
    integrationTypes: ["userInstall", "guildInstall"],
  },
  user: {
    name: "avatar",
    integrationTypes: ["userInstall", "guildInstall"],
  },
} as const satisfies FullCommandDefinition;


export class AvatarCommand extends Command {

  constructor(client: ArcClient) {
    super(client, definer);
  }


  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {

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
  }

}