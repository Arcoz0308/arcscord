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
    },
  },
  user: {
    name: "avatar",
  },
} as const satisfies FullCommandDefinition;


export class AvatarCommand extends Command<typeof definer> {

  name = "avatar";

  definer: typeof definer;

  constructor(client: ArcClient) {
    super(client, definer);

    this.definer = definer;
  }


  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {

    const user = ctx.isSlashCommand
      ? ctx.options.user || ctx.user : ctx.targetUser;

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Avatar de ${user.displayName}`)
          .setImage(user.displayAvatarURL() || user.defaultAvatarURL),
      ],
      ephemeral: true,
    });
  }

}