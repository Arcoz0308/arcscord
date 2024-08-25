import type { ArcClient, CommandRunContext, CommandRunResult } from "../../src";
import { Command } from "../../src";
import type { FullCommandDefinition } from "../../src/base/command/command_definition.type";

const definer = {
  slash: {
    name: "test",
    description: "test command",
    options: {
      role: {
        type: "role",
        description: "name",
        required: true,
      },
      user: {
        type: "user",
        description: "name",
        required: true,
      },
      lang: {
        type: "string",
        description: "lang",
        required: false,
        choices: [
          {
            name: "en",
            value: "en",
          },
          {
            name: "fr",
            value: "fr",
          },
        ],
      },
    },
    subCommands: [],
  },
} as const satisfies FullCommandDefinition;


export class TestCommand extends Command<typeof definer> {

  name = "test";

  constructor(client: ArcClient) {
    super(client, definer);
  }

  run(ctx: CommandRunContext<typeof definer>): Promise<CommandRunResult> {
    if (ctx.options.lang === "fr") {
      return ctx.reply(`Tu as choisis le role ${ctx.options.role.name} pour ${ctx.options.user.username}`);
    } else {
      return ctx.reply(`You have chosen the role ${ctx.options.role.name} for ${ctx.options.user.username}`);
    }
  }

}