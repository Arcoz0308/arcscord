import type { Client } from "#/base/client/client.class";
import type { CommandRunContext } from "#/base/command/command.type";
import type { UObject } from "#/utils/type/type";
import type { DevFacultative } from "#/manager/dev/dev.type";

export abstract class Command<E extends UObject|null = null> implements DevFacultative {

  isEnableInDev = false;

  protected constructor(public client: Client) {
  }

  abstract run(ctx: CommandRunContext<E>): Promise<void>

}