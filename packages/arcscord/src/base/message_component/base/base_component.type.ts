import type { componentTypes } from "#/base/message_component/base/base_component.enum";
import type { Button } from "#/base/message_component/button/button.class";
import type { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";
import type { SelectMenu } from "#/base/message_component/select_menu/select_menu.class";

export type ComponentType = keyof typeof componentTypes;
export type Component = Button|ModalSubmitComponent|SelectMenu;
