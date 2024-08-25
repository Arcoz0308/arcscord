import type { FullCommandDefinition } from "#/base/command/command_definition.type";
import type { ArcClient, CommandRunContext, CommandRunResult } from "#/base";
import { Command } from "#/base";
import { SlashCmdBuilder } from "#/utils";

const definer = {
  slash: {
    name: "test",
    description: "test command",
    options: {
      name: {
        description: "name",
        type: "user",
        required: true,
      },
    },
  },
} satisfies FullCommandDefinition;


export class TestCommand extends Command<typeof definer> {

  name = "test";

  slashBuilder = new SlashCmdBuilder()
    .setName("test")
    .setDescription("ouioui")
    .setDefaultMemberPermissions(6)
    .addSubcommandGroup((subcommandGroup) => subcommandGroup
      .setName("test1")
      .setDescription("ouioui")
      .addSubcommand((subCommand) => subCommand
        .setName("test2")
        .setDescription("test"))) as SlashCmdBuilder;


  constructor(client: ArcClient) {
    super(client, definer);
  }

  run(ctx: CommandRunContext<typeof definer>): Promise<CommandRunResult> {


    return ctx.ok(true);
  }

}