import type { CommandProps } from "#/base";
import type { commandContextsEnum, commandIntegrationTypesEnum } from "#/base/command/command.enum";
import type { OptionsList } from "#/base/command/option.type";
import type { LocaleMap } from "#/utils/discord/type/locale.type";
import type { PermissionsString } from "discord.js";

/**
 * Type representing command integration types.
 * @see [Discord Docs](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
 */
export type CommandIntegrationType = keyof typeof commandIntegrationTypesEnum;

/**
 * Type representing command contexts.
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
 */
export type CommandContexts = keyof typeof commandContextsEnum;

/**
 * Base command definition properties.
 */
export type BaseCommandDefinition = {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * Localization map for the command name.
   */
  nameLocalizations?: LocaleMap;

  /**
   * Default member permissions required to execute the command.
   */
  defaultMemberPermissions?: PermissionsString | PermissionsString[];

  /**
   * If the command is marked as NSFW (Not Safe For Wumpus).
   */
  nsfw?: boolean;

  /**
   * Integration types for the command.
   * @see [Discord Docs](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
   */
  integrationTypes?: CommandIntegrationType[];

  /**
   * Contexts where the command can be used.
   * @see [Discord Docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
   */
  contexts?: CommandContexts[];
};

/**
 * Slash command definition properties.
 */
export type SlashCommandDefinition = BaseCommandDefinition & {
  /**
   * The description of the slash command.
   */
  description: string;

  /**
   * Localization map for the command description.
   */
  descriptionLocalizations?: LocaleMap;

  /**
   * Options for the slash command.
   */
  options?: OptionsList;
};

/**
 * Subcommand definition properties.
 */
export type SubCommandDefinition = {
  /**
   * The name of the subcommand.
   */
  name: string;

  /**
   * Localization map for the subcommand name.
   */
  nameLocalizations?: LocaleMap;

  /**
   * Description of the subcommand.
   */
  description: string;

  /**
   * Localization map for the subcommand description.
   */
  descriptionLocalizations?: LocaleMap;

  /**
   * Options for the subcommand.
   */
  options?: OptionsList;
};

/**
 * Definition for a group of subcommands.
 */
export type SubCommandGroupDefinition = Omit<
  SubCommandDefinition,
  "options" | "name"
> & {
  /**
   * List of subcommands in the group.
   */
  subCommands: CommandProps<SubCommandDefinition>[];
};

/**
 * Definition for a slash command with subcommands.
 */
export type SlashWithSubsCommandDefinition = BaseCommandDefinition & {
  /**
   * Description of the command.
   */
  description: string;

  /**
   * Localization map for the command description.
   */
  descriptionLocalizations?: LocaleMap;

  /**
   * List of subcommands.
   */
  subCommands?: CommandProps<SubCommandDefinition>[];

  /**
   * Groups of subcommands.
   */
  subCommandsGroups?: Record<string, SubCommandGroupDefinition>;
};

/**
 * Full command definition, which can include slash, message, and user command definitions.
 */
export type FullCommandDefinition = {
  /**
   * Slash command definition.
   */
  slash?: SlashCommandDefinition;

  /**
   * Message command definition.
   */
  message?: BaseCommandDefinition;

  /**
   * User command definition.
   */
  user?: BaseCommandDefinition;
};

/**
 * Partial command definition specifically for slash commands.
 */
export type PartialCommandDefinitionForSlash = Required<Pick<FullCommandDefinition, "slash">>;

/**
 * Partial command definition specifically for message commands.
 */
export type PartialCommandDefinitionForMessage = Required<Pick<FullCommandDefinition, "message">>;

/**
 * Partial command definition specifically for user commands.
 */
export type PartialCommandDefinitionForUser = Required<Pick<FullCommandDefinition, "user">>;

/**
 * Union type for different command definitions.
 */
export type CommandDefinition =
  | CommandProps<FullCommandDefinition>
  | SlashWithSubsCommandDefinition;
