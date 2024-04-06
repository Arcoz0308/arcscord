import type { Result } from "#/utils/error/error.type";
import type { EventError } from "#/utils/error/class/event_error.class";

export type EventHandleResult = Result<string|true, EventError>;