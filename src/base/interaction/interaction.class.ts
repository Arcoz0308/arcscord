import type { Client } from "#/base/client/client.class";
import type { DevFacultative } from "#/manager/dev";
import type { InteractionDefaultReplyOptions } from "#/base/interaction/interaction.type";

export abstract class InteractionBase implements DevFacultative {

  isEnableInDev = false;

  abstract name: string;

  defaultReplyOptions: InteractionDefaultReplyOptions = {
    preReply: false,
    ephemeral: true,
  };

  protected constructor(public client: Client) {
  }

}