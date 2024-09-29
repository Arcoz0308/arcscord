import { buildClickableButton, createButton } from "#/base/components";

export const disableComponentButton = createButton({
  matcher: "disableComponent",
  build: (id) => buildClickableButton({
    style: "red",
    label: "Disable button",
    customId: "disableComponent" + id, // for test beginWith
  }),
  run: (ctx) => {
    return ctx.disableComponent("component");
  },
});