import type { ArcClient } from "#/base";
import type { CommandContexts, CommandIntegrationType } from "#/base/command/command_definition.type";
import type { ChoiceNumber, ChoiceString, CommandOptionType, Option, OptionsList } from "#/base/command/option.type";
import type { LocaleCallback } from "#/manager";
import type { LocaleMap } from "#/utils";
import type { ChannelType } from "#/utils/discord/type/channel.type";
import type { APIApplicationCommandBasicOption, APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { commandContextsEnum, commandIntegrationTypesEnum, commandOptionTypesEnum } from "#/base/command/command.enum";
import { channelTypeEnum } from "#/utils/discord/type/channel.enum";

export function localizationToAPI(locales: LocaleMap | LocaleCallback | undefined, client: ArcClient, name = false): LocaleMap | undefined {
  if (typeof locales === "undefined") {
    return undefined;
  }
  if (typeof locales !== "function") {
    return locales;
  }
  if (!client.localeManager.enabled) {
    client.localeManager.trace("locale manager is disabled, skip localization");
    return undefined;
  }
  const newMap: LocaleMap = {};
  for (const locale of client.localeManager.availableLanguages) {
    const lang = client.localeManager.mapLanguage(locale);
    const t = client.localeManager.i18n.getFixedT(lang);
    let trad = locales(t);
    if (name) {
      trad = trad.replaceAll(".", "-").replaceAll(":", "_").slice(-32);
    }
    newMap[locale] = trad;
  }
  return newMap;
}

export function contextsToAPI(contexts: CommandContexts[]): number[] {
  return contexts.map(context => commandContextsEnum[context]);
}

export function integrationTypeToAPI(
  interactionTypes: CommandIntegrationType[],
): number[] {
  return interactionTypes.map(
    interactionType => commandIntegrationTypesEnum[interactionType],
  );
}

export function optionTypeToAPI(type: CommandOptionType): number {
  return commandOptionTypesEnum[type];
}

export function optionChannelTypeToAPI(
  channelTypes: Exclude<ChannelType, "dm" | "groupDm">[],
): number[] {
  return channelTypes.map(channelType => channelTypeEnum[channelType]);
}

export function stringChoiceToAPI(
  choices: (string | ChoiceString)[] | Record<string, string> | undefined,
): APIApplicationCommandOptionChoice<string>[] | undefined {
  if (!choices) {
    return undefined;
  }

  if (Array.isArray(choices)) {
    return choices.map((choice) => {
      if (typeof choice === "string") {
        return {
          name: `${choice}`,
          value: choice,
        };
      }
      return choice;
    });
  }

  return Object.keys(choices).map((choice) => {
    return {
      name: choice,
      value: choices[choice],
    };
  });
}

export function numberChoiceToAPI(
  choices: (number | ChoiceNumber)[] | Record<string, number> | undefined,
): APIApplicationCommandOptionChoice<number>[] | undefined {
  if (!choices) {
    return undefined;
  }

  if (Array.isArray(choices)) {
    return choices.map((choice) => {
      if (typeof choice === "number") {
        return {
          name: `${choice}`,
          value: choice,
        };
      }
      return choice;
    });
  }

  return Object.keys(choices).map((choice) => {
    return {
      name: choice,
      value: choices[choice],
    };
  });
}

export function optionToAPI(
  name: string,
  option: Option,
  client: ArcClient,
): APIApplicationCommandBasicOption {
  const baseOption: Omit<APIApplicationCommandBasicOption, "type"> = {
    name,
    description: option.description,
    name_localizations: localizationToAPI(option.nameLocalizations, client, true),
    description_localizations: localizationToAPI(option.descriptionLocalizations, client),
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
          choices: stringChoiceToAPI(option.choices),
        };
      }
      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        min_length: option.min_length,
        max_length: option.max_length,
        choices: undefined,
        autocomplete:
          "autocomplete" in option ? option.autocomplete : undefined,
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
          choices: numberChoiceToAPI(option.choices),
        };
      }

      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        min_value: option.min_value,
        max_value: option.max_value,
        choices: undefined,
        autocomplete:
          "autocomplete" in option ? option.autocomplete : undefined,
      };
    }

    case "channel": {
      return {
        ...baseOption,
        type: optionTypeToAPI(option.type),
        channel_types: option.channel_types
          ? optionChannelTypeToAPI(option.channel_types)
          : undefined,
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
}

export function optionListToAPI(
  list: OptionsList,
  client: ArcClient,
): APIApplicationCommandBasicOption[] {
  const options: APIApplicationCommandBasicOption[] = [];
  for (const [name, option] of Object.entries(list)) {
    options.push(optionToAPI(name, option, client));
  }

  return options;
}
