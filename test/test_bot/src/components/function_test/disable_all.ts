import { buildClickableButton, createButton } from "arcscord";

export const disableAllButton = createButton({
  matcher: "disableAll",
  build: (id) =>
    buildClickableButton({
      style: "red",
      label: "Disable All",
      customId: "disableAll" + id,
    }),
  run: (ctx) => {
    return ctx.disableComponent();
  },
});
