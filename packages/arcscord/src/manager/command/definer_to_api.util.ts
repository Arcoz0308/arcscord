import type {
  BaseCommandDefinition,
  CommandContexts,
  CommandIntegrationType,
  SlashOptionsCommandDefinition,
  SlashWithSubsCommandDefinition,
  SubCommandDefinition
} from "#/base/command/command_definition.type";
import type { APIApplicationCommandBasicOption, APIApplicationCommandSubcommandOption } from "discord-api-types/v10";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  type Permissions,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord-api-types/v10";
import type { PermissionsString } from "discord.js";
import { PermissionsBitField } from "discord.js";
import { commandContextsEnum, commandIntegrationTypesEnum, commandOptionTypesEnum } from "#/base/command/command.enum";
import type { APIApplicationCommandOption } from "discord-api-types/payloads/v10/";
import { hasOption, hasSubCommands } from "#/base";
import type { CommandOptionType, Option, OptionsList } from "#/base/command/option.type";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import { channelTypeEnum } from "#/utils/discord/type/channel.enum";

export const permissionToAPI = (perm: PermissionsString | PermissionsString[]): Permissions => {
  const permResolvable = new PermissionsBitField();
  if (Array.isArray(perm)) {
    permResolvable.add(...perm);
  } else {
    permResolvable.add(perm);
  }


  return permResolvable.bitfield.toString(10);
};

export const contextsToAPI = (contexts: CommandContexts[]): number[] => {
  return contexts.map((context) => commandContextsEnum[context]);
};

export const integrationTypeToAPI = (interactionTypes: CommandIntegrationType[]) => {
  return interactionTypes.map((interactionType) => commandIntegrationTypesEnum[interactionType]);
};

export const optionTypeToAPI = (type: CommandOptionType) => {
  return commandOptionTypesEnum[type];
};

export const optionChannelTypeToAPI = (channelTypes: Exclude<ChannelType, "dm" | "groupDm">[]): number[] => {
  return channelTypes.map((channelType) => channelTypeEnum[channelType]);
};

export const optionToAPI = (name: string, option: Option): APIApplicationCommandBasicOption => {

  const baseOption: Omit<APIApplicationCommandBasicOption, "type"> = {
    name: name,
    description: option.description,
    name_localizations: option.nameLocalizations,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  };

  switch (option.type) {
    case "string": {
      if ("choices" in option) {
        return {
          ...baseOption,
          type: optionTypeToAPI(option.type),
          min_length: option.min_length,
          max_length: option.max_length,
          autocomplete: option.autocomplete,
          choices: option.choices,
        };
      }
      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        min_length: option.min_length,
        max_length: option.max_length,
        choices: undefined,
        autocomplete: "autocomplete" in option ? option.autocomplete : undefined,
      };
    }

    case "number":
    case "integer": {
      if ("choices" in option) {
        return {
          ...baseOption,
          type: optionTypeToAPI(option.type),
          min_value: option.min_value,
          max_value: option.max_value,
          autocomplete: option.autocomplete,
          choices: option.choices,
        };
      }

      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        min_value: option.min_value,
        max_value: option.max_value,
        choices: undefined,
        autocomplete: "autocomplete" in option ? option.autocomplete : undefined,
      };
    }

    case "channel": {
      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        channel_types: option.channel_types ? optionChannelTypeToAPI(option.channel_types) : undefined,
      };
    }

    case "user":
    case "role":
    case "mentionable":
    case "attachment":
    case "boolean": {
      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
      };
    }
  }
};

export const optionListToAPI = (list: OptionsList): APIApplicationCommandBasicOption[] => {
  const options: APIApplicationCommandBasicOption[] = [];
  for (const [name, option] of Object.entries(list)) {
    options.push(optionToAPI(name, option));
  }

  return options;
};

export const subCommandDefinerToAPI = (definer: SubCommandDefinition): APIApplicationCommandSubcommandOption => {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    name: definer.name,
    description: definer.description,
    name_localizations: definer.nameLocalizations,
    description_localizations: definer.descriptionLocalizations,
    options: definer.options ? optionListToAPI(definer.options) : undefined,
  };
};

export const anyOptionsToAPI = (definer: SlashOptionsCommandDefinition | SlashWithSubsCommandDefinition):
  APIApplicationCommandOption[] | undefined => {

  const options: APIApplicationCommandOption[] = [];

  if (hasSubCommands(definer)) {
    if (definer.subCommandsGroups) {
      for (const group in definer.subCommandsGroups) {
        const values = definer.subCommandsGroups[group];

        const groupOption: APIApplicationCommandOption = {
          type: ApplicationCommandOptionType.SubcommandGroup,
          name: group,
          description: values.description,
          name_localizations: values.nameLocalizations,
          description_localizations: values.descriptionLocalizations,
          options: values.subCommands.map((subCommand) => subCommandDefinerToAPI(subCommand.definer)),
        };

        options.push(groupOption);
      }
    }

    if (definer.subCommands) {
      options.push(...definer.subCommands.map((subCommand) => subCommandDefinerToAPI(subCommand.definer)));
    }
  }

  if (hasOption(definer)) {
    if (!definer.options) {
      return undefined;
    }
    options.push(...optionListToAPI(definer.options));
  }

  return options.length > 0 ? options : undefined;
};

export const slashDefinerToAPI = (definer: SlashOptionsCommandDefinition | SlashWithSubsCommandDefinition):
  RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return {
    type: ApplicationCommandType.ChatInput,
    name: definer.name,
    description: definer.description,
    name_localizations: definer.nameLocalizations,
    description_localizations: definer.descriptionLocalizations,
    default_member_permissions: definer.defaultMemberPermissions
      ? permissionToAPI(definer.defaultMemberPermissions) : undefined,
    nsfw: definer.nsfw,
    contexts: definer.contexts ? contextsToAPI(definer.contexts) : undefined,
    integration_types: definer.integrationTypes ? integrationTypeToAPI(definer.integrationTypes) : undefined,
    options: anyOptionsToAPI(definer),
  };
};

export const messageDefinerToAPI = (definer: BaseCommandDefinition):
  RESTPostAPIContextMenuApplicationCommandsJSONBody => {
  return {
    type: ApplicationCommandType.Message,
    name: definer.name,
    name_localizations: definer.nameLocalizations,
    default_member_permissions: definer.defaultMemberPermissions
      ? permissionToAPI(definer.defaultMemberPermissions) : undefined,
    nsfw: definer.nsfw,
    contexts: definer.contexts ? contextsToAPI(definer.contexts) : undefined,
    integration_types: definer.integrationTypes ? integrationTypeToAPI(definer.integrationTypes) : undefined,
  };
};

export const userDefinerToAPI = (definer: BaseCommandDefinition):
  RESTPostAPIContextMenuApplicationCommandsJSONBody => {
  return {
    type: ApplicationCommandType.User,
    name: definer.name,
    name_localizations: definer.nameLocalizations,
    default_member_permissions: definer.defaultMemberPermissions
      ? permissionToAPI(definer.defaultMemberPermissions) : undefined,
    nsfw: definer.nsfw,
    contexts: definer.contexts ? contextsToAPI(definer.contexts) : undefined,
    integration_types: definer.integrationTypes ? integrationTypeToAPI(definer.integrationTypes) : undefined,
  };
};