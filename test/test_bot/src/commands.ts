import type { CommandDefinition } from "arcscord";
import { autocompleteCommand } from "./commands/autocomplete";
import { avatarCommand } from "./commands/avatar";
import { componentTestCommand } from "./commands/component_test";
import { disableComponentCommand } from "./commands/disable_component";
import { messageInfosCommand } from "./commands/message_infos";
import { testMiddlewareCommand } from "./commands/middleware";
import { subCommand } from "./commands/sub/def";

export const commands: CommandDefinition[] = [
  avatarCommand,
  messageInfosCommand,
  componentTestCommand,
  autocompleteCommand,
  disableComponentCommand,
  testMiddlewareCommand,
  subCommand,
];
