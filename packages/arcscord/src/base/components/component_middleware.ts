import type { ComponentContext, ComponentRunResult } from "#/base";
import type { MaybePromise } from "#/utils/type/util.type";

/**
 * Represents the next middleware to be processed.
 * @template T - The object that the middleware return
 */
export type NextComponentMiddleware<T extends NonNullable<unknown>> = {
  cancel: null;
  next: T;
};

/**
 * Represents a component middleware that cancels the component.
 */
export type CancelComponentMiddleware = {
  cancel: MaybePromise<ComponentRunResult>;
  next: null;
};

/**
 * Union type representing the result of a component middleware run.
 * @template T - The object that the middleware return
 */
export type ComponentMiddlewareRun<T extends NonNullable<unknown>> =
  | NextComponentMiddleware<T>
  | CancelComponentMiddleware;

/**
 * Abstract class representing a component middleware.
 */
export abstract class ComponentMiddleware {
  /**
   * The name of the middleware.
   *
   * @remarks add a const after the name, like `name = "example" as const`
   */
  abstract readonly name: string;

  /**
   * Run the middleware.
   * @param ctx - The component context.
   * @returns The result of the middleware run.
   */
  abstract run(
    ctx: ComponentContext
  ): MaybePromise<ComponentMiddlewareRun<NonNullable<unknown>>>;

  /**
   * Create the next middleware run result.
   * @template T - The type of the next value.
   * @param value - The next value to be processed.
   * @returns The next middleware run result.
   */
  next<T extends NonNullable<unknown>>(value: T): ComponentMiddlewareRun<T> {
    return {
      cancel: null,
      next: value,
    };
  }

  /**
   * Create the cancel middleware run result.
   * @template T - The type of the cancellation result.
   * @param value - The cancel value.
   * @returns The cancel middleware run result.
   */
  cancel<T extends NonNullable<unknown>>(
    value: MaybePromise<ComponentRunResult>,
  ): ComponentMiddlewareRun<T> {
    return {
      cancel: value,
      next: null,
    };
  }
}
