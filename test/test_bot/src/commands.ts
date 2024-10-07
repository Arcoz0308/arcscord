import type { CommandDefinition } from "arcscord";
import { avatarCommand } from "./commands/avatar";
import { messageInfosCommand } from "./commands/message_infos";
import { componentTestCommand } from "./commands/component_test";
import { autocompleteCommand } from "./commands/autocomplete";
import { disableComponentCommand } from "./commands/disable_component";
import { testMiddlewareCommand } from "./commands/middleware";

export const commands: CommandDefinition[] = [
  avatarCommand,
  messageInfosCommand,
  componentTestCommand,
  autocompleteCommand,
  disableComponentCommand,
  testMiddlewareCommand,
];
