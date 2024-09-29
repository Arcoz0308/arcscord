import { buildClickableButton, createButton } from "#/base/components";

export const disableRowButton = createButton({
  matcher: "disableRow",
  build: (id) => buildClickableButton({
    style: "red",
    label: "Disable Row",
    customId: "disableRow" + id,
  }),
  run: (ctx) => {
    return ctx.disableComponent("actionRow");
  },
});