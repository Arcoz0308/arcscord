import { buildClickableButton, createButton } from "arcscord";

export const disableRowButton = createButton({
  matcher: "disableRow",
  build: id =>
    buildClickableButton({
      style: "red",
      label: "Disable Row",
      customId: `disableRow${id}`,
    }),
  run: (ctx) => {
    return ctx.disableComponent("actionRow");
  },
});
