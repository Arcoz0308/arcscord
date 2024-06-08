import type { CommandRunContext, CommandRunResult, SlashCommand } from "#/base/command";
import { Command } from "#/base/command";
import { SlashCmdBuilder } from "#/utils";

export class TestCommand extends Command implements SlashCommand {

  name = "test";

  slashBuilder = new SlashCmdBuilder()
    .setName("test")
    .setDescription("test");


  run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.reply(ctx, "hello !!");
  }

}