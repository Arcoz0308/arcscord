import type { CommandRunContext, CommandRunResult, SlashCommand } from "#/base";
import { Command, SlashCmdBuilder } from "#/index";

export class TestCommand extends Command implements SlashCommand {

  name = "test";

  slashBuilder = new SlashCmdBuilder()
    .setName("test")
    .setDescription("test");


  run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.reply(ctx, "hello !!");
  }

}