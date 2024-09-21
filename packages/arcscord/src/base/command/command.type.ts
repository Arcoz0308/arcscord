import type { CommandError } from "#/utils/error/class/command_error";
import type { Result } from "@arcscord/error";
import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord-api-types/v10";

export type CommandType = "slash" | "user" | "message";


export type CommandRunResult = Result<string|true, CommandError>;

export type APICommandObject = {
  slash?: RESTPostAPIChatInputApplicationCommandsJSONBody;
  message?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  user?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
}