import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import type { ChatInputCommandInteraction, CommandInteraction, CommandInteractionOption } from "discord.js";
import type {
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SlashOptionsCommandDefinition,
  SlashWithSubsCommandDefinition
} from "#/base/command/command_definition.type";
import type { ContextOptions, OptionsList } from "#/base/command/option.type";
import type { Result } from "@arcscord/error";
import { error } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";

export const hasSlashCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForSlash => {
  return "slash" in definer;
};

export const hasMessageCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForMessage => {
  return "message" in definer;
};

export const hasUserCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForUser => {
  return "user" in definer;
};


export const hasSubCommands = (definer: SlashOptionsCommandDefinition | SlashWithSubsCommandDefinition):
  definer is SlashWithSubsCommandDefinition => {
  return "subCommands" in definer || "subCommandsGroups" in definer;
};

export const hasOption = (definer: SlashOptionsCommandDefinition | SlashWithSubsCommandDefinition):
  definer is SlashOptionsCommandDefinition => {
  return "options" in definer;
};

export const commandTypeToString = (type: ApplicationCommandType): string => {
  switch (type) {
    case ApplicationCommandType.ChatInput:
      return "Slash Command";
    case ApplicationCommandType.Message:
      return "Message Command";
    case ApplicationCommandType.User:
      return "User Command";
    default:
      return "Unknown Command type";
  }
};

export const slashCommandOptionValueToString = (option: CommandInteractionOption): string => {
  switch (option.type as ApplicationCommandOptionType) {
    case ApplicationCommandOptionType.Subcommand: {
      return `Sub<${option.name}>`;
    }
    case ApplicationCommandOptionType.SubcommandGroup: {
      return `SubGroup<${option.name}>`;
    }
    case ApplicationCommandOptionType.String: {
      return `String<${option.value}>`;
    }
    case ApplicationCommandOptionType.Integer: {
      return `Integer<${option.value}>`;
    }
    case ApplicationCommandOptionType.Boolean: {
      return `Boolean<${option.value}>`;
    }
    case ApplicationCommandOptionType.User: {
      return `User<${option.value}>`;
    }
    case ApplicationCommandOptionType.Channel: {
      return `Channel<${option.value}>`;
    }
    case ApplicationCommandOptionType.Role: {
      return `Role<${option.value}>`;
    }
    case ApplicationCommandOptionType.Mentionable: {
      return `Mentionable<${option.value}>`;
    }
    case ApplicationCommandOptionType.Number: {
      return `Number<${option.value}>`;
    }
    case ApplicationCommandOptionType.Attachment: {
      return `Attachment<${typeof option.value === "string" && option.value.length < 50 ? option.value : "to length"}>`;
    }
    default: {
      return `Unknown<${option.value}>`;
    }
  }
};

export const commandInteractionToString = (interaction: CommandInteraction, noOptions = true): string => {
  switch (true) {
    case interaction.isChatInputCommand(): {

      let commandName = interaction.commandName;

      let options = interaction.options.data;
      if (options[0]?.type as ApplicationCommandOptionType === ApplicationCommandOptionType.SubcommandGroup) {
        commandName += `.${options[0].name}`;
        options = options[0].options || [];
      }

      if (options[0]?.type as ApplicationCommandOptionType === ApplicationCommandOptionType.Subcommand) {
        commandName += `.${options[0].name}`;
        options = options[0].options || [];
      }

      const stringOptions = options.map((option) => `${option.name}=${slashCommandOptionValueToString(option)}`).join(" ");

      return `slash:${commandName} (${interaction.commandId}) ${noOptions ? "" : stringOptions}`;
    }
    case  interaction.isUserContextMenuCommand(): {

      return `user:${interaction.commandName} (${interaction.commandId}) targetUser=${interaction.targetId}`;
    }

    case interaction.isMessageContextMenuCommand(): {

      const targetChannel = interaction.targetMessage.channelId;
      const targetGuild = interaction.targetMessage.guildId;


      return `msg:${interaction.commandName} (${interaction.commandId}) targetMessage=${interaction.targetId}`
      + `targetChannel=${targetChannel}`
      + targetGuild ? `targetGuild=${targetGuild}` : "";
    }
    default: {
      return "Unknown Command";
    }
  }
};

export const parseOptions = <T extends OptionsList | undefined>(interaction: ChatInputCommandInteraction, optionsList: T):
  Result<(T extends OptionsList ? ContextOptions<T> : undefined), BaseError> => {

  return error(new BaseError({
    message: "",
  }));
};