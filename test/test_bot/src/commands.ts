import type { Command } from "arcscord";
import { autocompleteCommand } from "./commands/autocomplete";
import { avatarCommand } from "./commands/avatar";
import { componentTestCommand } from "./commands/component_test";
import { disableComponentCommand } from "./commands/disable_component";
import { i18nCommand } from "./commands/i18n";
import { messageInfosCommand } from "./commands/message_infos";
import { testMiddlewareCommand } from "./commands/middleware";
import { subCommand } from "./commands/sub/def";

export const commands: Command[] = [
  avatarCommand,
  messageInfosCommand,
  componentTestCommand,
  autocompleteCommand,
  disableComponentCommand,
  testMiddlewareCommand,
  subCommand,
  i18nCommand,
];
