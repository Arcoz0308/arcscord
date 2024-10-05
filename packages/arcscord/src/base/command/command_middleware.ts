import type { CommandContext, CommandRunResult } from "#/base";
import type { MaybePromise } from "#/utils/type/util.type";

export type NextCommandMiddleware<T extends NonNullable<unknown>> = {
  cancel: null;
  next: T;
}

export type CancelCommandMiddleware = {
  cancel: MaybePromise<CommandRunResult>;
  next: null;
}

export type CommandMiddlewareRun<T extends NonNullable<unknown>> = NextCommandMiddleware<T> | CancelCommandMiddleware;

export abstract class CommandMiddleware {

  abstract readonly name: string;

  abstract run(ctx: CommandContext): MaybePromise<CommandMiddlewareRun<NonNullable<unknown>>>;

  next<T extends NonNullable<unknown>>(value: T): CommandMiddlewareRun<T> {
    return {
      cancel: null,
      next: value,
    };
  }

  cancel<T extends NonNullable<unknown>>(value: MaybePromise<CommandRunResult>): CommandMiddlewareRun<T> {
    return {
      cancel: value,
      next: null,
    };
  }

}