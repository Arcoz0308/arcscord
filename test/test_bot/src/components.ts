import type { ComponentProps } from "arcscord";
import { simpleButton } from "./components/simple_button";
import { stringSelectMenu } from "./components/string_select_menu";
import { userSelectMenu } from "./components/user_select_menu";
import { roleSelectMenu } from "./components/role_select_menu";
import { mentionableSelectMenu } from "./components/mentionable_select_menu";
import { channelSelectMenu } from "./components/channel_select_menu";
import { modal } from "./components/modal";
import { disableAllButton } from "./components/function_test/disable_all";
import { disableRowButton } from "./components/function_test/disableRow";
import { disableComponentButton } from "./components/function_test/disableComponent";
import { editButton } from "./components/function_test/edit";
import { deferEditButton } from "./components/function_test/defer_edit";

export const components: ComponentProps[] = [
  simpleButton,
  stringSelectMenu,
  userSelectMenu,
  roleSelectMenu,
  mentionableSelectMenu,
  channelSelectMenu,
  modal,
  disableAllButton,
  disableRowButton,
  disableComponentButton,
  editButton,
  deferEditButton,
];
