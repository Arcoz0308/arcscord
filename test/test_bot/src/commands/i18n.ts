import { createCommand } from "arcscord";

export const i18nCommand = createCommand({
  build: {
    slash: {
      name: "i18n",
      nameLocalizations: t => t("test:i18n.command.name"),
      description: "default description",
      descriptionLocalizations: t => t("test:i18n.command.description"),
    },
  },
  run: (ctx) => {
    return ctx.reply(ctx.t("test:i18n.command.run"), {
      ephemeral: true,
    });
  },
});
