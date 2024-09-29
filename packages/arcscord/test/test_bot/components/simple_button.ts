import { buildClickableButton, createButton } from "#/base/components";

export const simpleButton = createButton({
  matcher: "simple_button",
  build: () => buildClickableButton({
    label: "Simple Button",
    style: "secondary",
    customId: "simple_button",
  }),
  run: (ctx) => {
    return ctx.reply("Clicked !");
  },
});