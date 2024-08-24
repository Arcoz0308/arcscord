import { Command, CommandRunContext, CommandRunResult, SlashCmdBuilder, SlashCommand } from "../../src";

export class TestCommand extends Command implements SlashCommand {

  name = "test";

  slashBuilder = new SlashCmdBuilder()
    .setName("test")
    .setDescription("test");


  run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return ctx.error("C'est codé avec le cul");
  }

}