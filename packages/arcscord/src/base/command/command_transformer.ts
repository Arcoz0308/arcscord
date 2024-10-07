import type {
  APICommandObject,
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
  optionListToAPI,
} from "#/utils/discord/tranformers/command";
import { permissionToAPI } from "#/utils/discord/tranformers/permission";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord-api-types/v10";

export function commandToAPI(definer: FullCommandDefinition): APICommandObject {
  const obj: APICommandObject = {};

  if (definer.slash) {
    const def = definer.slash;

    obj.slash = {
      type: ApplicationCommandType.ChatInput,
      name: def.name,
      description: def.description,
      name_localizations: def.nameLocalizations,
      description_localizations: def.descriptionLocalizations,
      default_member_permissions: def.defaultMemberPermissions
        ? permissionToAPI(def.defaultMemberPermissions)
        : undefined,
      nsfw: def.nsfw,
      contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
      integration_types: def.integrationTypes
        ? integrationTypeToAPI(def.integrationTypes)
        : undefined,
      options: def.options ? optionListToAPI(def.options) : undefined,
    };
  }

  if (definer.user) {
    const def = definer.user;

    obj.user = {
      type: ApplicationCommandType.User,
      name: def.name,
      name_localizations: def.nameLocalizations,
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
      name_localizations: def.nameLocalizations,
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
): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    name: definer.name,
    description: definer.description,
    name_localizations: definer.nameLocalizations,
    description_localizations: definer.descriptionLocalizations,
    options: definer.options ? optionListToAPI(definer.options) : undefined,
  };
}

export function subCommandListToAPI(
  def: SlashWithSubsCommandDefinition,
): RESTPostAPIChatInputApplicationCommandsJSONBody {
  const subCommands: (
    | APIApplicationCommandSubcommandOption
    | APIApplicationCommandSubcommandGroupOption
  )[] = [];

  if (def.subCommands) {
    subCommands.push(
      ...def.subCommands.map(cmd => subCommandToAPI(cmd.build)),
    );
  }

  if (def.subCommandsGroups) {
    for (const [name, option] of Object.entries(def.subCommandsGroups)) {
      subCommands.push({
        type: ApplicationCommandOptionType.SubcommandGroup,
        name,
        description: option.description,
        name_localizations: option.nameLocalizations,
        description_localizations: option.descriptionLocalizations,
        options: option.subCommands.map(cmd => subCommandToAPI(cmd.build)),
      });
    }
  }

  return {
    name: def.name,
    description: def.description,
    name_localizations: def.nameLocalizations,
    description_localizations: def.descriptionLocalizations,
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
