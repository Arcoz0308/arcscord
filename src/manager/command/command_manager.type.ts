import type { CommandInteraction } from "discord.js";
import type { Command } from "#/base/command";
import type { CommandError, Result } from "#/utils";

export type CommandResultHandlerInfos = {
  result: Result<string|true, CommandError>;
  interaction: CommandInteraction;
  command: Command;
  defer: boolean;
  start: number;
  end: number;
}

export type CommandResultHandler = (infos: CommandResultHandlerInfos) => void | Promise<void>;

export type CommandResultHandlerImplementer = {
  resultHandler: CommandResultHandler;
}