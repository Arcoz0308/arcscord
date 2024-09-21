import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import type { ChatInputCommandInteraction, CommandInteraction, CommandInteractionOption } from "discord.js";
import { BaseChannel, GuildMember, Role, User } from "discord.js";
import type {
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser
} from "#/base/command/command_definition.type";
import type { ContextOptions, Option, OptionalContextOption, OptionsList } from "#/base/command/option.type";
import type { Result } from "@arcscord/error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseError } from "@arcscord/better-error";
import type { Command } from "#/base";

export const isSlashCommand = (command: Command): command is Command<PartialCommandDefinitionForSlash> => {
  return "slash" in command.definer;
};

export const isUserCommand = (command: Command): command is Command<PartialCommandDefinitionForUser> => {
  return "user" in command.definer;
};

export const isMessageCommand = (command: Command): command is Command<PartialCommandDefinitionForMessage> => {
  return "message" in command.definer;
};


export const hasSlashCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForSlash => {
  return "slash" in definer;
};

export const hasMessageCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForMessage => {
  return "message" in definer;
};

export const hasUserCommand = (definer: FullCommandDefinition): definer is PartialCommandDefinitionForUser => {
  return "user" in definer;
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

      return `slash:${commandName} (${interaction.commandId})${noOptions ? "" : " " + stringOptions}`;
    }
    case  interaction.isUserContextMenuCommand(): {

      return `user:${interaction.commandName} (${interaction.commandId}) targetUser=${interaction.targetId}`;
    }

    case interaction.isMessageContextMenuCommand(): {

      const targetChannel = interaction.targetMessage.channelId;
      const targetGuild = interaction.targetMessage.guildId;


      return `msg:${interaction.commandName} (${interaction.commandId}) targetMessage=${interaction.targetId}`
        + ` targetChannel=${targetChannel}`
        + (targetGuild ? ` targetGuild=${targetGuild}` : "");
    }
    default: {
      return "Unknown Command";
    }
  }
};

export const parseOptions = async <T extends OptionsList>(interaction: ChatInputCommandInteraction, optionsList: T):
  Promise<Result<(ContextOptions<T>), BaseError>> => {

  const result: Record<string, OptionalContextOption<Option>> = {};

  for (const [name, option] of Object.entries(optionsList)) {
    switch (option.type) {
      case "user": {
        const user = interaction.options.getUser(name, false);
        if (!user && option.required) {
          return error(new BaseError({
            message: `User is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));

        }
        result[name] = user || undefined;
        break;
      }

      case "role": {
        const role = interaction.options.getRole(name, false);
        if (!role && option.required) {
          return error(new BaseError({
            message: `Role is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (!(role instanceof Role) && role !== null) {
          try {
            const roleObj = await interaction.guild?.roles.fetch(role.id);
            if (!roleObj) {
              return error(new BaseError({
                message: `Failed to fetch role with id ${role.id} in guild ${interaction.guildId}`,
                debugs: {
                  options: interaction.options.data,
                  definer: optionsList,
                },
              }));
            }

            result[name] = roleObj;
          } catch (e) {
            return error(new BaseError({
              message: `Failed to fetch role with id ${role.id} in guild ${interaction.guildId}`,
              originalError: anyToError(e),
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }));
          }
        } else {
          result[name] = role || undefined;
        }
        break;
      }

      case "channel": {
        const channel = interaction.options.getChannel(name, false);
        if (!channel && option.required) {
          return error(new BaseError({
            message: `Channel is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (channel instanceof BaseChannel || channel === null) {
          result[name] = channel || undefined;
        } else {
          try {
            const channelObj = await interaction.guild?.channels.fetch(channel.id);
            if (!channelObj) {
              return error(new BaseError({
                message: `Failed to fetch channel with id ${channel.id} in guild ${interaction.guildId}`,
                debugs: {
                  options: interaction.options.data,
                  definer: optionsList,
                },
              }));
            }

            result[name] = channelObj;
          } catch (e) {
            return error(new BaseError({
              message: `Failed to fetch channel with id ${channel.id} in guild ${interaction.guildId}`,
              originalError: anyToError(e),
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }));
          }
        }
        break;
      }

      case "mentionable": {
        const mentionable = interaction.options.getMentionable(name, false);
        if (!mentionable && option.required) {
          return error(new BaseError({
            message: `Mention is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (mentionable instanceof Role || mentionable instanceof User) {
          result[name] = mentionable;
          break;
        }

        if (mentionable instanceof GuildMember) {
          result[name] = mentionable.user;
          break;
        }
        if (mentionable === null) {
          result[name] = undefined;
          break;
        }
        // todo handle with partial
        return error(new BaseError({
          message: "Current not supported, get ApiRole/ApiMember for mentionable",
          debugs: {
            options: interaction.options.data,
            definer: optionsList,
          },
        }));

      }

      case "boolean": {
        const boolean = interaction.options.getBoolean(name, false);
        if (boolean === null && option.required) {
          return error(new BaseError({
            message: `Boolean is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        result[name] = boolean !== null ? boolean : undefined;
        break;
      }

      case "attachment": {
        const attachment = interaction.options.getAttachment(name, false);
        if (!attachment && option.required) {
          return error(new BaseError({
            message: `Attachment is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        result[name] = attachment || undefined;
        break;
      }

      case "string": {
        const value = interaction.options.getString(name, false);
        if (!value && option.required) {
          return error(new BaseError({
            message: `String is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (value === null) {
          result[name] = undefined;
          break;
        }

        if (option.min_length && value.length < option.min_length) {
          return error(new BaseError({
            message: `Minimum length is required, get ${value.length}, min required is ${option.min_length}`
              + `for option ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (option.max_length && value.length > option.max_length) {
          return error(new BaseError({
            message: `Maximum length exceeded, get ${value.length}, max ${option.min_length} for option ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if ("choices" in option) {
          if (option.choices?.findIndex((v) => v.value === value) === -1) {
            return error(new BaseError({
              message: `Invalid choice for ${name} option received`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
                value: value,
                valid: option.choices.map((v) => v.value),
              },
            }));
          }
        }

        result[name] = value;
        break;
      }

      case "integer":
      case "number": {
        const value = option.type === "number"
          ? interaction.options.getNumber(name, false) : interaction.options.getInteger(name, false);
        if (!value && option.required) {
          return error(new BaseError({
            message: `Number is required, get undefined for ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (value === null) {
          result[name] = undefined;
          break;
        }

        if (option.min_value && value < option.min_value) {
          return error(new BaseError({
            message: `Minimum value is required, get ${value}, min required is ${option.min_value} for option ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if (option.max_value && value > option.max_value) {
          return error(new BaseError({
            message: `Maximum value exceeded, get ${value}, max ${option.max_value} for option ${name}`,
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }));
        }

        if ("choices" in option) {
          if (option.choices?.findIndex((v) => v.value === value) === -1) {
            return error(new BaseError({
              message: `Invalid choice for ${name} option received`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
                value: value,
                valid: option.choices.map((v) => v.value),
              },
            }));
          }
        }

        result[name] = value;
        break;
      }
    }
  }

  return ok(result as ContextOptions<T>);


};