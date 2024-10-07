import type { CommandProps } from "#/base";
import type { CommandError } from "#/utils";
import type { Result } from "@arcscord/error";
import type { CommandInteraction } from "discord.js";

export type CommandResultHandlerInfos = {
  result: Result<string | true, CommandError>;
  interaction: CommandInteraction;
  command: CommandProps;
  defer: boolean;
  start: number;
  end: number;
};

export type CommandResultHandler = (
  infos: CommandResultHandlerInfos,
) => void | Promise<void>;

export type CommandResultHandlerImplementer = {
  resultHandler: CommandResultHandler;
};
