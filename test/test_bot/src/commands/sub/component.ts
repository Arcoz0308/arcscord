import { buildButtonActionRow, createCommand } from "arcscord";
import { modal } from "../../components/modal";
import { simpleButton } from "../../components/simple_button";
import { stringSelectMenu } from "../../components/string_select_menu";

export const buttonComponentSubCommand = createCommand({
  build: {
    name: "button",
    description: "Send a button",
  },
  run: (ctx) => {
    return ctx.reply("Button :", {
      components: [buildButtonActionRow(simpleButton.build())],
    });
  },
});

export const modalComponentSubCommand = createCommand({
  build: {
    name: "modal",
    description: "show a modal",
  },
  run: (ctx) => {
    return ctx.showModal(modal.build("Sub command"));
  },
});

export const stringSelectMenuComponentSubCommand = createCommand({
  build: {
    name: "string-select-menu",
    description: "Send a string menu",
  },
  run: (ctx) => {
    return ctx.reply("Button :", {
      components: [stringSelectMenu.build()],
    });
  },
});
