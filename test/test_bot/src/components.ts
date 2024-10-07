import type { ComponentProps } from "arcscord";
import { channelSelectMenu } from "./components/channel_select_menu";
import { deferEditButton } from "./components/function_test/defer_edit";
import { disableAllButton } from "./components/function_test/disable_all";
import { disableComponentButton } from "./components/function_test/disableComponent";
import { disableRowButton } from "./components/function_test/disableRow";
import { editButton } from "./components/function_test/edit";
import { mentionableSelectMenu } from "./components/mentionable_select_menu";
import { modal } from "./components/modal";
import { roleSelectMenu } from "./components/role_select_menu";
import { simpleButton } from "./components/simple_button";
import { stringSelectMenu } from "./components/string_select_menu";
import { userSelectMenu } from "./components/user_select_menu";

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
