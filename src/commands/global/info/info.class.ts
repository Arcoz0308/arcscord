import type { CommandRunContext, CommandRunResult, SlashCommand } from "#/base/command";
import { Command } from "#/base/command";
import { infoSlashBuilder } from "#/commands/global/info/info.builder";
import { EmbedBuilder } from "discord.js";

export class InfoCommand extends Command implements SlashCommand {

  name = "info";

  slashBuilder = infoSlashBuilder;

  run(ctx: CommandRunContext): Promise<CommandRunResult> {
    return this.reply(ctx, {
      embeds: [new EmbedBuilder()
        .setTitle("infos")
        .setDescription("template made by Arcoz")],
    });
  }

}