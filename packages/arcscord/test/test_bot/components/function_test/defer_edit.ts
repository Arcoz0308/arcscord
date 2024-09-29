import { buildClickableButton, createButton } from "#/base/components";

export const deferEditButton = createButton({
  matcher: "deferEdit",
  build: () => buildClickableButton({
    style: "primary",
    label: "Edit",
    customId: "deferEdit",
  }),
  run: (ctx) => {
    return ctx.deferUpdateMessage();
  },
});