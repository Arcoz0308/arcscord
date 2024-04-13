import type { componentTypes } from "#/base/message_component/base/base_component.enum";
import type { ButtonComponent } from "#/base/message_component/button/button.class";
import type { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";

export type ComponentType = keyof typeof componentTypes;

export type Component = ButtonComponent|ModalSubmitComponent