import { buildModal, createModal } from "arcscord";

export const modal = createModal({
  matcher: "modal",
  build: title =>
    buildModal(
      title,
      "modal",
      {
        label: "name",
        style: "short",
        customId: "name",
      },
      {
        label: "age",
        style: "short",
        customId: "age",
      },
    ),
  run: (ctx) => {
    return ctx.reply(
      `Your name is ${ctx.values.get("name")} and you are ${ctx.values.get("age")} !`,
    );
  },
});
