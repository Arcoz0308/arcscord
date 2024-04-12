import { InteractionBase } from "#/base/interaction/interaction.class";
import type { MessageComponentType } from "#/base/message_component/base/base_message_component.type";

export abstract class BaseMessageComponent extends InteractionBase {

  isEnableInDev = true;

  abstract customId: string;

  abstract type: MessageComponentType;

}