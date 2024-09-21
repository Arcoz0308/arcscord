import type { CommandInteraction } from "discord.js";
import type { CommandError } from "#/utils";
import type { Result } from "@arcscord/error";
import type { Command, SubCommand } from "#/base";

export type CommandResultHandlerInfos = {
  result: Result<string|true, CommandError>;
  interaction: CommandInteraction;
  command: Command | SubCommand;
  defer: boolean;
  start: number;
  end: number;
}

export type CommandResultHandler = (infos: CommandResultHandlerInfos) => void | Promise<void>;

export type CommandResultHandlerImplementer = {
  resultHandler: CommandResultHandler;
}