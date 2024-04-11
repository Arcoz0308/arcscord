import { InteractionBase } from "#/base/interaction/interaction.class";

export abstract class BaseMessageComponent extends InteractionBase {

  isEnableInDev = true;

  abstract customId: string;

}