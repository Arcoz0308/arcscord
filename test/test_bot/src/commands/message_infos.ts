import { createCommand } from "arcscord";

export const messageInfosCommand = createCommand({
  build: {
    message: {
      name: "message-infos",
      integrationTypes: ["userInstall", "guildInstall"],
    },
  },
  run: (ctx) => {
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
  },
});
