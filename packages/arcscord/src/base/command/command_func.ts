import type { CommandHandler, FullCommandDefinition, SubCommandDefinition } from "#/base";
import type { CommandMiddleware } from "#/base/command/command_middleware";

/**
 * Create a Command or a SubCommand
 * @param options command properties options
 *
 * @example
 * ```ts
 * createCommand({
 *   build: {
 *     slash: {
 *       name: "ping",
 *       description: "get a pong",
 *     },
 *   },
 *   run: (ctx) => {
 *     return ctx.reply("Pong");
 *   },
 * });
 * ```
 */
export function createCommand<
  Definer extends FullCommandDefinition | SubCommandDefinition,
  Middlewares extends CommandMiddleware[] = [],
>(
  options: CommandHandler<Definer, Middlewares>,
): CommandHandler<Definer, Middlewares> {
  return options;
}
