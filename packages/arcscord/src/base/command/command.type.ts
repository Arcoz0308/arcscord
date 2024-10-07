import type {
  CommandContext,
  FullCommandDefinition,
  SubCommandDefinition,
} from "#/base";
import type { AutocompleteContext } from "#/base/command/autocomplete_context";
import type { CommandMiddleware } from "#/base/command/command_middleware";
import type { CommandError } from "#/utils/error/class/command_error";
import type { MaybePromise } from "#/utils/type/util.type";
import type { Result } from "@arcscord/error";
import type { PermissionsString } from "discord.js";
import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types/v10";

export type CommandType = "slash" | "user" | "message";

export type CommandOptions = {
  /**
   * @default []
   */
  neededPermissions?: PermissionsString[];

  /**
   * @default false
   */
  preReply?: boolean;

  /**
   * @default false
   */
  preReplyEphemeral?: boolean;

  /**
   * @default false
   */
  developerCommand?: boolean;
};

export type CommandRunResult = Result<string | true, CommandError>;

export type APICommandObject = {
  slash?: RESTPostAPIChatInputApplicationCommandsJSONBody;
  message?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  user?: RESTPostAPIContextMenuApplicationCommandsJSONBody;
};

export type AutocompleteCommand = {
  autocomplete: (ctx: AutocompleteContext) => Promise<CommandRunResult>;
};

export type CommandProps<
  Definer extends SubCommandDefinition | FullCommandDefinition = | SubCommandDefinition
  | FullCommandDefinition,
  Middlewares extends CommandMiddleware[] = CommandMiddleware[],
> = {
  build: Definer;
  options?: CommandOptions;
  run: (
    ctx: CommandContext<Definer, Middlewares>,
  ) => MaybePromise<CommandRunResult>;
  use?: Middlewares;
  autocomplete?: (ctx: AutocompleteContext) => MaybePromise<CommandRunResult>;
};
