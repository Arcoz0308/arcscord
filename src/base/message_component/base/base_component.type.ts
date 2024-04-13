import type { componentTypes } from "#/base/message_component/base/base_component.enum";
import type { ButtonComponent } from "#/base/message_component/button/button.class";
import type { TextInputComponent } from "#/base/message_component/text_input/test_input.class";

export type ComponentType = keyof typeof componentTypes;

export type Component = ButtonComponent|TextInputComponent