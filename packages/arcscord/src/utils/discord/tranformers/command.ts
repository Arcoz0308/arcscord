import type {
  CommandContexts,
  CommandIntegrationType,
  SlashWithSubsCommandDefinition
} from "#/base/command/command_definition.type";
import { commandContextsEnum, commandIntegrationTypesEnum, commandOptionTypesEnum } from "#/base/command/command.enum";
import type { CommandOptionType, Option, OptionsList } from "#/base/command/option.type";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import { channelTypeEnum } from "#/utils/discord/type/channel.enum";
import type {
  APIApplicationCommandBasicOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { permissionToAPI } from "#/utils/discord/tranformers/permission";

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

export const subCommandDefinitionToAPI = (def: SlashWithSubsCommandDefinition):
  RESTPostAPIChatInputApplicationCommandsJSONBody => {

  const subCommands: (APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption)[] = [];

  if (def.subCommands) {
    subCommands.push(...def.subCommands.map((cmd) => cmd.toAPIObject()));
  }

  if (def.subCommandsGroups) {
    for (const [name, option] of Object.entries(def.subCommandsGroups)) {
      subCommands.push({
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: name,
        description: option.description,
        name_localizations: option.nameLocalizations,
        description_localizations: option.descriptionLocalizations,
        options: option.subCommands.map((cmd) => cmd.toAPIObject()),
      });
    }
  }

  return {
    name: def.name,
    description: def.description,
    name_localizations: def.nameLocalizations,
    description_localizations: def.descriptionLocalizations,
    default_member_permissions: def.defaultMemberPermissions
      ? permissionToAPI(def.defaultMemberPermissions) : undefined,
    nsfw: def.nsfw,
    contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
    integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
    options: subCommands,
  };

};