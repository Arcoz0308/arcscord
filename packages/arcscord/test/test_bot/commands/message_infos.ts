import type { FullCommandDefinition } from "#/base/command/command_definition.type";
import { type ArcClient, Command, type CommandRunResult } from "#/base";
import type { CommandContext } from "#/base/command/command_context";

const definer = {
  message: {
    name: "message-infos",
    integrationTypes: ["userInstall", "guildInstall"],
  },
} satisfies FullCommandDefinition;

export class MessageInfosCommand extends Command {

  constructor(client: ArcClient) {
    super(client, definer);
  }

  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {
    const infos: Set<string> = new Set();
    const message = ctx.targetMessage;

    if (message.author.bot) {
      infos.add("Bot yes");
    }

    if (message.content) {
      infos.add(`content length ${message.content.length}`);
    }

    if (message.embeds.length > 0) {
      infos.add(`embed length ${message.content.length}`);
    }

    if (message.author.flags?.has("ActiveDeveloper")) {
      infos.add("Author is developer");
    }

    return ctx.reply(Array.from(infos.values()).join("\n"), {
      ephemeral: true,
    });
  }

}