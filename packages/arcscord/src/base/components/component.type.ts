import type { Result } from "@arcscord/error";
import type { ComponentError } from "#/utils";

export type ComponentRunResult = Result<true | string, ComponentError>;