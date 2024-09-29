import type { ArcClient } from "#/base";
import type { CommandDefinition } from "#/base/command/command_definition.type";
import { AvatarCommand } from "./commands/avatar";
import { MessageInfosCommand } from "./commands/message_infos";
import { ComponentTestCommand } from "./commands/component_test";

export const commands = (client: ArcClient): CommandDefinition[] => [
  new AvatarCommand(client),
  new MessageInfosCommand(client),
  new ComponentTestCommand(client),
];