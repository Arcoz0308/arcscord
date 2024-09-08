import type { ArcClient, CommandRunResult, SubCommandRunContext } from "#/base";
import { SubCommand } from "#/base";
import type { SubCommandDefinition } from "#/base/command/command_definition.type";

const definer = {
  name: "ping",
  description: "Pong!",
  options: {
    name: {
      type: "string",
      required: false,
      description: "Name",
    },
  },
} satisfies SubCommandDefinition;

export class Ping extends SubCommand<typeof definer> {

  constructor(client: ArcClient) {
    super(client, definer, {
      neededPermissions: ["Administrator"],
    });
  }

  run(ctx: SubCommandRunContext<typeof definer>): Promise<CommandRunResult> {

    return ctx.reply(`Pong ! ${ctx.options.name ? `How are you ${ctx.options.name} ?` : ""}`);
  }

}