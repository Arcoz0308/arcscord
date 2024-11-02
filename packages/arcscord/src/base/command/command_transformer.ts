import type {
  APICommandObject,
  ArcClient,
  FullCommandDefinition,
  SlashWithSubsCommandDefinition,
  SubCommandDefinition,
} from "#/base";
import type {
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import {
  contextsToAPI,
  integrationTypeToAPI,
  localizationToAPI,
  optionListToAPI,
} from "#/utils/discord/tranformers/command";
import { permissionToAPI } from "#/utils/discord/tranformers/permission";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

export function commandToAPI(definer: FullCommandDefinition, client: ArcClient): APICommandObject {
  const obj: APICommandObject = {};

  if (definer.slash) {
    const def = definer.slash;

    obj.slash = {
      type: ApplicationCommandType.ChatInput,
      name: def.name,
      description: def.description,
      name_localizations: localizationToAPI(def.nameLocalizations, client),
      description_localizations: localizationToAPI(def.descriptionLocalizations, client),
      default_member_permissions: def.defaultMemberPermissions
        ? permissionToAPI(def.defaultMemberPermissions)
        : undefined,
      nsfw: def.nsfw,
      contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
      integration_types: def.integrationTypes
        ? integrationTypeToAPI(def.integrationTypes)
        : undefined,
      options: def.options ? optionListToAPI(def.options, client) : undefined,
    };
  }

  if (definer.user) {
    const def = definer.user;

    obj.user = {
      type: ApplicationCommandType.User,
      name: def.name,
      name_localizations: localizationToAPI(def.nameLocalizations, client),
      default_member_permissions: def.defaultMemberPermissions
        ? permissionToAPI(def.defaultMemberPermissions)
        : undefined,
      nsfw: def.nsfw,
      contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
      integration_types: def.integrationTypes
        ? integrationTypeToAPI(def.integrationTypes)
        : undefined,
    };
  }

  if (definer.message) {
    const def = definer.message;

    obj.message = {
      type: ApplicationCommandType.Message,
      name: def.name,
      name_localizations: localizationToAPI(def.nameLocalizations, client),
      default_member_permissions: def.defaultMemberPermissions
        ? permissionToAPI(def.defaultMemberPermissions)
        : undefined,
      nsfw: def.nsfw,
      contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
      integration_types: def.integrationTypes
        ? integrationTypeToAPI(def.integrationTypes)
        : undefined,
    };
  }

  return obj;
}

export function subCommandToAPI(
  definer: SubCommandDefinition,
  client: ArcClient,
): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    name: definer.name,
    description: definer.description,
    name_localizations: localizationToAPI(definer.nameLocalizations, client),
    description_localizations: localizationToAPI(definer.descriptionLocalizations, client),
    options: definer.options ? optionListToAPI(definer.options, client) : undefined,
  };
}

export function subCommandListToAPI(
  def: SlashWithSubsCommandDefinition,
  client: ArcClient,
): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const subCommands: (
    | APIApplicationCommandSubcommandOption
    | APIApplicationCommandSubcommandGroupOption
  )[] = [];

  if (def.subCommands) {
    subCommands.push(
      ...def.subCommands.map(cmd => subCommandToAPI(cmd.build, client)),
    );
  }

  if (def.subCommandsGroups) {
    for (const [name, option] of Object.entries(def.subCommandsGroups)) {
      subCommands.push({
        type: ApplicationCommandOptionType.SubcommandGroup,
        name,
        description: option.description,
        name_localizations: localizationToAPI(option.nameLocalizations, client),
        description_localizations: localizationToAPI(option.descriptionLocalizations, client),
        options: option.subCommands.map(cmd => subCommandToAPI(cmd.build, client)),
      });
    }
  }

  return {
    name: def.name,
    description: def.description,
    name_localizations: localizationToAPI(def.nameLocalizations, client),
    description_localizations: localizationToAPI(def.descriptionLocalizations, client),
    default_member_permissions: def.defaultMemberPermissions
      ? permissionToAPI(def.defaultMemberPermissions)
      : undefined,
    nsfw: def.nsfw,
    contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
    integration_types: def.integrationTypes
      ? integrationTypeToAPI(def.integrationTypes)
      : undefined,
    options: subCommands,
  };
}
