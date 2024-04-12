import { BaseMessageComponent } from "#/base/message_component/base/base_message_component.class";
import type { MessageComponentType } from "#/base/message_component/base/base_message_component.type";

export abstract class TextInputComponent extends BaseMessageComponent {

  type: MessageComponentType = "textInput";

}