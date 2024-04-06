import type { BaseError } from "#/utils/error/class/base_error.class";
import type { BaseInteraction, ClientEvents, CommandInteraction } from "discord.js";
import type { Command, CommandRunContext } from "#/base/command";
import type { SubCommand } from "#/base/sub_command/sub_command.class";
import type { Event } from "#/base/event/event.class";
import type { Task } from "#/base/task/task.class";

export type ResultOk<T> = [T, null];
export type ResultError<E> = [null, E];

export type Result<T, E> = ResultOk<T>|ResultError<E>;


export type ErrorOptions = {
  message?: string;
  baseError?: BaseError|Error;
  debugs?: DebugValues;
}

export type DebugValues = {[key: string]: unknown};
export type DebugValueString = [key: string, value: string];

export type InteractionErrorOptions = ErrorOptions & {
  interaction: BaseInteraction;
}

export type CommandErrorOptions = InteractionErrorOptions & {
  interaction: CommandInteraction;
  context: CommandRunContext;
  command: Command|SubCommand;
}

export type EventErrorOptions = ErrorOptions & {
  event: Event<keyof ClientEvents>;
}

export type TaskErrorOptions = ErrorOptions & {
  task: Task;
}