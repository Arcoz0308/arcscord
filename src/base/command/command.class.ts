import type { CommandRunContext } from "#/base/command/command.type";
import type { UObject } from "#/utils/type/type";
import { InteractionBase } from "#/base/interaction/interaction.class";

export abstract class Command<E extends UObject|null = null> extends InteractionBase {


  abstract run(ctx: CommandRunContext<E>): Promise<void>

}