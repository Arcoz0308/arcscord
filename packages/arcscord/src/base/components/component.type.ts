import type { ComponentError } from "#/utils";
import type { Result } from "@arcscord/error";

/**
 * Represents the result of running a component.
 */
export type ComponentRunResult = Result<true | string, ComponentError>;
