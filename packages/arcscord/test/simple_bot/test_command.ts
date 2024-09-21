import type { ArcClient, CommandRunResult } from "../../src";
import { Command } from "../../src";
import type { FullCommandDefinition } from "../../src/base/command/command_definition.type";
import type { ImageSize } from "discord.js";
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
          {
            name: "2048",
            value: 2048,
          },
          {
            name: "4096",
            value: 4096,
          },
        ],
      },
    },
  },
  user: {
    name: "avatar",
  },
} as const satisfies FullCommandDefinition;


export class TestCommand extends Command<typeof definer> {

  name = "avatar";

  definer: typeof definer;

  constructor(client: ArcClient) {
    super(client, definer);

    this.definer = definer;
  }


  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {
    const user = ctx.isSlashCommand
      ? ctx.options.user || ctx.user
      : ctx.targetUser;

    const size: ImageSize = ctx.isSlashCommand
      ? ctx.options.size || 4096 : 4096;

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Avatar de ${user.displayName}`)
          .setImage(user.displayAvatarURL({
            size: size,
          }) || user.defaultAvatarURL),
      ],
      ephemeral: true,
    });
  }

}