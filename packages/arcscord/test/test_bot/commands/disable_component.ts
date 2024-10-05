import { createCommand } from "#/base/command/command_func";
import { buildButtonActionRow, buildLinkButton } from "#/base/components";
import { disableAllButton } from "../components/function_test/disable_all";
import { disableRowButton } from "../components/function_test/disableRow";
import { disableComponentButton } from "../components/function_test/disableComponent";
import { roleSelectMenu } from "../components/role_select_menu";
import { stringSelectMenu } from "../components/string_select_menu";
import { userSelectMenu } from "../components/user_select_menu";
import { editButton } from "../components/function_test/edit";
import { deferEditButton } from "../components/function_test/defer_edit";

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
        buildButtonActionRow(disableAllButton.build(""), disableRowButton.build(""), disableComponentButton.build("")),
        buildButtonActionRow(disableRowButton.build("a"), buildLinkButton({
          url: "https://acz.sh/arcscord",
          label: "Github Link",
        }), editButton.build(), deferEditButton.build()),
        roleSelectMenu.build(),
        stringSelectMenu.build("fun", "no fun"),
        userSelectMenu.build(),
      ],
    });
  },
});