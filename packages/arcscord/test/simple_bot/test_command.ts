import type { ArcClient, CommandRunContext, CommandRunResult } from "../../src";
import { Command } from "../../src";
import type { FullCommandDefinition } from "../../src/base/command/command_definition.type";
import type { ImageSize } from "discord.js";
import { EmbedBuilder } from "discord.js";

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


  run(ctx: CommandRunContext<typeof definer>): Promise<CommandRunResult> {
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

/* const subCommandDefinition = {
  name: "test",
  description: "test command",
  options: {
    age: {
      type: "number",
      description: "Votre age",
      min_value: 0,
      max_value: 200,
      required: true,
    },
  },
} as const satisfies SubCommandDefinition;

class TestSubCommand extends SubCommand<typeof subCommandDefinition> {

  constructor(client: ArcClient, command: Command) {
    super(client, command, subCommandDefinition);
  }

  run(ctx: SubCommandRunContext<typeof subCommandDefinition>): Promise<CommandRunResult> {
    return ctx.reply(`Tu as ${ctx.options.age * 12} mois environs`);
  }

} */