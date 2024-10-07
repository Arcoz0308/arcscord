import { buildButtonActionRow, buildLinkButton, createCommand } from "arcscord";
import { deferEditButton } from "../components/function_test/defer_edit";
import { disableAllButton } from "../components/function_test/disable_all";
import { disableComponentButton } from "../components/function_test/disableComponent";
import { disableRowButton } from "../components/function_test/disableRow";
import { editButton } from "../components/function_test/edit";
import { roleSelectMenu } from "../components/role_select_menu";
import { stringSelectMenu } from "../components/string_select_menu";
import { userSelectMenu } from "../components/user_select_menu";

export const disableComponentCommand = createCommand({
  build: {
    slash: {
      name: "disable-component",
      description: "disable component",
    },
  },
  run: (ctx) => {
    return ctx.reply({
      content: "Components:",
      components: [
        buildButtonActionRow(
          disableAllButton.build(""),
          disableRowButton.build(""),
          disableComponentButton.build(""),
        ),
        buildButtonActionRow(
          disableRowButton.build("a"),
          buildLinkButton({
            url: "https://acz.sh/arcscord",
            label: "Github Link",
          }),
          editButton.build(),
          deferEditButton.build(),
        ),
        roleSelectMenu.build("select a role"),
        stringSelectMenu.build("fun", "no fun"),
        userSelectMenu.build(),
      ],
    });
  },
});
