import type { CommandProps } from "#/base";
import type { commandContextsEnum, commandIntegrationTypesEnum } from "#/base/command/command.enum";
import type { OptionsList } from "#/base/command/option.type";
import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { PermissionsString } from "discord.js";

export type CommandIntegrationType = keyof typeof commandIntegrationTypesEnum;

export type CommandContexts = keyof typeof commandContextsEnum;

export type BaseCommandDefinition = {
  name: string;
  nameLocalizations?: LocaleMap;
  defaultMemberPermissions?: PermissionsString | PermissionsString[];
  nsfw?: boolean;
  integrationTypes?: CommandIntegrationType[];
  contexts?: CommandContexts[];
};

export type SlashCommandDefinition = BaseCommandDefinition & {
  description: string;
  descriptionLocalizations?: LocaleMap;
  options?: OptionsList;
};

export type SubCommandDefinition = {
  name: string;
  nameLocalizations?: LocaleMap;
  description: string;
  descriptionLocalizations?: LocaleMap;
  options?: OptionsList;
};

export type SubCommandGroupDefinition = Omit<
  SubCommandDefinition,
  "options" | "name"
> & {
  subCommands: CommandProps<SubCommandDefinition>[];
};

export type SlashWithSubsCommandDefinition = BaseCommandDefinition & {
  description: string;
  descriptionLocalizations?: LocaleMap;
  subCommands?: CommandProps<SubCommandDefinition>[];
  subCommandsGroups?: Record<string, SubCommandGroupDefinition>;
};

export type FullCommandDefinition = {
  slash?: SlashCommandDefinition;
  message?: BaseCommandDefinition;
  user?: BaseCommandDefinition;
};

export type PartialCommandDefinitionForSlash = Required<Pick<FullCommandDefinition, "slash">>;

export type PartialCommandDefinitionForMessage = Required<Pick<FullCommandDefinition, "message">>;

export type PartialCommandDefinitionForUser = Required<Pick<FullCommandDefinition, "user">>;

export type CommandDefinition =
  | CommandProps<FullCommandDefinition>
  | SlashWithSubsCommandDefinition;
