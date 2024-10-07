import { buildClickableButton, createButton } from "arcscord";

export const disableComponentButton = createButton({
  matcher: "disableComponent",
  build: (id) =>
    buildClickableButton({
      style: "red",
      label: "Disable button",
      customId: "disableComponent" + id, // for test beginWith
    }),
  run: (ctx) => {
    return ctx.disableComponent("component");
  },
});
