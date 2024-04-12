import type { messageComponentTypes } from "#/base/message_component/base/base_message_component.enum";
import type { ButtonComponent } from "#/base/message_component/button/button.class";
import type { TextInputComponent } from "#/base/message_component/text_input/test_input.class";

export type MessageComponentType = keyof typeof messageComponentTypes;

export type MessageComponent = ButtonComponent|TextInputComponent