import type { CommandRunContext, CommandRunResult } from "#/base/command/command.type";
import { InteractionBase } from "#/base/interaction/interaction.class";

export abstract class Command extends InteractionBase {


  abstract run(ctx: CommandRunContext): Promise<CommandRunResult>

}