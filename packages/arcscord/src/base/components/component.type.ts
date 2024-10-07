import type { ComponentError } from "#/utils";
import type { Result } from "@arcscord/error";

export type ComponentRunResult = Result<true | string, ComponentError>;
