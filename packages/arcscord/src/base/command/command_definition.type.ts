import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { PermissionsString } from "discord.js";
import type { commandContextsEnum, commandIntegrationTypesEnum } from "#/base/command/command.enum";
import type { OptionsList } from "#/base/command/option.type";
import type { Command, SubCommand } from "#/base";

export type CommandIntegrationType = keyof typeof commandIntegrationTypesEnum;

export type CommandContexts = keyof typeof commandContextsEnum;

export type BaseCommandDefinition = {
  name: string;
  nameLocalizations?: LocaleMap;
  defaultMemberPermissions?: PermissionsString | PermissionsString[];
  nsfw?: boolean;
  integrationTypes?: CommandIntegrationType[];
  contexts?: CommandContexts[];
}

export type BaseSlashCommandDefinition = BaseCommandDefinition & {
  description: string;
  descriptionLocalizations?: LocaleMap;
}

export type SlashOptionsCommandDefinition = BaseSlashCommandDefinition & {
  options?: OptionsList;
}


export type SubCommandDefinition = {
  name: string;
  nameLocalizations?: LocaleMap;
  description: string;
  descriptionLocalizations?: LocaleMap;
  options?: OptionsList;
}

export type SubCommandGroupDefinition = Omit<SubCommandDefinition, "options" | "name"> & {
  subCommands: SubCommand[];
};

export type SlashWithSubsCommandDefinition = BaseSlashCommandDefinition & {
  subCommands?: SubCommand[];
  subCommandsGroups?: Record<string, SubCommandGroupDefinition>;
}

export type PartialCommandDefinitionForSlash = {
  slash: SlashOptionsCommandDefinition;
}

export type PartialCommandDefinitionForMessage = {
  message: BaseCommandDefinition;
}

export type PartialCommandDefinitionForUser = {
  user: BaseCommandDefinition;
}

export type FullCommandDefinition = Partial<
  PartialCommandDefinitionForSlash
  & PartialCommandDefinitionForMessage
  & PartialCommandDefinitionForUser
>

export type CommandDefinition = Command | SlashWithSubsCommandDefinition;