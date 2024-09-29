import { buildClickableButton, createButton } from "#/base/components";

export const editButton = createButton({
  matcher: "edit",
  build: () => buildClickableButton({
    style: "primary",
    label: "Edit",
    customId: "edit",
  }),
  run: (ctx) => {
    return ctx.updateMessage({
      content: "Updated !",
    });
  },
});