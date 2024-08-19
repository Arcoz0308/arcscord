import type { EventError } from "#/utils/error/class/event_error";
import type { Result } from "@arcscord/error";

export type EventHandleResult = Result<string|true, EventError>;