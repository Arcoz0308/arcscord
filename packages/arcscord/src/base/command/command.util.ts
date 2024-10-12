import type { AutocompleteCommand, CommandProps } from "#/base";
import type {
  FullCommandDefinition,
  PartialCommandDefinitionForMessage,
  PartialCommandDefinitionForSlash,
  PartialCommandDefinitionForUser,
  SlashWithSubsCommandDefinition,
} from "#/base/command/command_definition.type";
import type { ContextOptions, Option, OptionalContextOption, OptionsList } from "#/base/command/option.type";
import type { Result } from "@arcscord/error";
import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  CommandInteractionOption,
} from "discord.js";
import { BaseError } from "@arcscord/better-error";
import { anyToError, error, ok } from "@arcscord/error";
import { BaseChannel, GuildMember, Role, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

/**
 * @internal
 */
export function isSubCommand(
  props: CommandProps | SlashWithSubsCommandDefinition,
): props is SlashWithSubsCommandDefinition {
  return "name" in props;
}

/**
 * @internal
 */
export function hasSlashCommand(
  definer: FullCommandDefinition,
): definer is PartialCommandDefinitionForSlash {
  return "slash" in definer;
}

/**
 * @internal
 */
export function hasMessageCommand(
  definer: FullCommandDefinition,
): definer is PartialCommandDefinitionForMessage {
  return "message" in definer;
}

/**
 * @internal
 */
export function hasUserCommand(
  definer: FullCommandDefinition,
): definer is PartialCommandDefinitionForUser {
  return "user" in definer;
}

/**
 * @internal
 */
export function hasAutocomplete(
  command: object,
): command is AutocompleteCommand {
  return "autocomplete" in command;
}

/**
 * Converts a CommandInteractionOption to a string representation based on its ApplicationCommandOptionType, like `Number<30>`
 *
 * @param option - The option to be converted to string.
 * @returns The string representation of the command option.
 */
export function slashCommandOptionValueToString(
  option: CommandInteractionOption,
): string {
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
}

/**
 * Make a full string of the command like `slash:ping (1292499977658040353)`
 * @param interaction the interaction of the command
 * @param noOptions if add value of options for slashCommands
 */
export function commandInteractionToString(
  interaction: CommandInteraction | AutocompleteInteraction,
  noOptions = true,
): string {
  switch (true) {
    case interaction.isChatInputCommand(): {
      let commandName = interaction.commandName;

      let options = interaction.options.data;
      if (
        (options[0]?.type as ApplicationCommandOptionType)
        === ApplicationCommandOptionType.SubcommandGroup
      ) {
        commandName += `.${options[0].name}`;
        options = options[0].options || [];
      }

      if (
        (options[0]?.type as ApplicationCommandOptionType)
        === ApplicationCommandOptionType.Subcommand
      ) {
        commandName += `.${options[0].name}`;
        options = options[0].options || [];
      }

      const stringOptions = options
        .map(
          option =>
            `${option.name}=${slashCommandOptionValueToString(option)}`,
        )
        .join(" ");

      return `slash:${commandName} (${interaction.commandId})${noOptions ? "" : ` ${stringOptions}`}`;
    }
    case interaction.isUserContextMenuCommand(): {
      return `user:${interaction.commandName} (${interaction.commandId}) targetUser=${interaction.targetId}`;
    }

    case interaction.isMessageContextMenuCommand(): {
      const targetChannel = interaction.targetMessage.channelId;
      const targetGuild = interaction.targetMessage.guildId;

      return (
        `msg:${interaction.commandName} (${interaction.commandId}) targetMessage=${interaction.targetId}`
        + ` targetChannel=${targetChannel}${
          targetGuild ? ` targetGuild=${targetGuild}` : ""
        }`
      );
    }
    default: {
      return "Unknown Command";
    }
  }
}

/**
 * @internal
 */
export async function parseOptions<T extends OptionsList>(
  interaction: ChatInputCommandInteraction,
  optionsList: T,
  required = true,
): Promise<Result<ContextOptions<T>, BaseError>> {
  const result: Record<string, OptionalContextOption<Option>> = {};

  for (const [name, option] of Object.entries(optionsList)) {
    switch (option.type) {
      case "user": {
        const user = interaction.options.getUser(name, false);
        if (!user && option.required && required) {
          return error(
            new BaseError({
              message: `User is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }
        result[name] = user || undefined;
        break;
      }

      case "role": {
        const role = interaction.options.getRole(name, false);
        if (!role && option.required && required) {
          return error(
            new BaseError({
              message: `Role is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (!(role instanceof Role) && role !== null) {
          try {
            const roleObj = await interaction.guild?.roles.fetch(role.id);
            if (!roleObj) {
              return error(
                new BaseError({
                  message: `Failed to fetch role with id ${role.id} in guild ${interaction.guildId}`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                  },
                }),
              );
            }

            result[name] = roleObj;
          }
          catch (e) {
            return error(
              new BaseError({
                message: `Failed to fetch role with id ${role.id} in guild ${interaction.guildId}`,
                originalError: anyToError(e),
                debugs: {
                  options: interaction.options.data,
                  definer: optionsList,
                },
              }),
            );
          }
        }
        else {
          result[name] = role || undefined;
        }
        break;
      }

      case "channel": {
        const channel = interaction.options.getChannel(name, false);
        if (!channel && option.required && required) {
          return error(
            new BaseError({
              message: `Channel is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (channel instanceof BaseChannel || channel === null) {
          result[name] = channel || undefined;
        }
        else {
          try {
            const channelObj = await interaction.guild?.channels.fetch(
              channel.id,
            );
            if (!channelObj) {
              return error(
                new BaseError({
                  message: `Failed to fetch channel with id ${channel.id} in guild ${interaction.guildId}`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                  },
                }),
              );
            }

            result[name] = channelObj;
          }
          catch (e) {
            return error(
              new BaseError({
                message: `Failed to fetch channel with id ${channel.id} in guild ${interaction.guildId}`,
                originalError: anyToError(e),
                debugs: {
                  options: interaction.options.data,
                  definer: optionsList,
                },
              }),
            );
          }
        }
        break;
      }

      case "mentionable": {
        const mentionable = interaction.options.getMentionable(name, false);
        if (!mentionable && option.required && required) {
          return error(
            new BaseError({
              message: `Mention is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
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
        return error(
          new BaseError({
            message:
              "Current not supported, get ApiRole/ApiMember for mentionable",
            debugs: {
              options: interaction.options.data,
              definer: optionsList,
            },
          }),
        );
      }

      case "boolean": {
        const boolean = interaction.options.getBoolean(name, false);
        if (boolean === null && option.required && required) {
          return error(
            new BaseError({
              message: `Boolean is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        result[name] = boolean !== null ? boolean : undefined;
        break;
      }

      case "attachment": {
        const attachment = interaction.options.getAttachment(name, false);
        if (!attachment && option.required && required) {
          return error(
            new BaseError({
              message: `Attachment is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        result[name] = attachment || undefined;
        break;
      }

      case "string": {
        const value = interaction.options.getString(name, false);
        if (!value && option.required && required) {
          return error(
            new BaseError({
              message: `String is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (value === null) {
          result[name] = undefined;
          break;
        }

        if (option.min_length && value.length < option.min_length) {
          return error(
            new BaseError({
              message:
                `Minimum length is required, get ${value.length}, min required is ${option.min_length}`
                + `for option ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (option.max_length && value.length > option.max_length) {
          return error(
            new BaseError({
              message: `Maximum length exceeded, get ${value.length}, max ${option.min_length} for option ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if ("choices" in option && option.choices) {
          if (Array.isArray(option.choices)) {
            if (
              !option.choices.find(choice =>
                typeof choice === "string"
                  ? choice === value
                  : choice.value === value,
              )
            ) {
              return error(
                new BaseError({
                  message: `Invalid choice for ${name} option received`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                    value,
                    valid: option.choices.map(v =>
                      typeof v === "string" ? v : v.value,
                    ),
                  },
                }),
              );
            }
          }
          else {
            if (!Object.values(option.choices).includes(value)) {
              return error(
                new BaseError({
                  message: `Invalid choice for ${name} option received`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                    value,
                    valid: Object.values(option.choices),
                  },
                }),
              );
            }
          }
        }

        result[name] = value;
        break;
      }

      case "integer":
      case "number": {
        const value
          = option.type === "number"
            ? interaction.options.getNumber(name, false)
            : interaction.options.getInteger(name, false);
        if (!value && option.required && required) {
          return error(
            new BaseError({
              message: `Number is required, get undefined for ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (value === null) {
          result[name] = undefined;
          break;
        }

        if (option.min_value && value < option.min_value) {
          return error(
            new BaseError({
              message: `Minimum value is required, get ${value}, min required is ${option.min_value} for option ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if (option.max_value && value > option.max_value) {
          return error(
            new BaseError({
              message: `Maximum value exceeded, get ${value}, max ${option.max_value} for option ${name}`,
              debugs: {
                options: interaction.options.data,
                definer: optionsList,
              },
            }),
          );
        }

        if ("choices" in option && option.choices) {
          if (Array.isArray(option.choices)) {
            if (
              !option.choices.find(choice =>
                typeof choice === "number"
                  ? choice === value
                  : choice.value === value,
              )
            ) {
              return error(
                new BaseError({
                  message: `Invalid choice for ${name} option received`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                    value,
                    valid: option.choices.map(v =>
                      typeof v === "number" ? v : v.value,
                    ),
                  },
                }),
              );
            }
          }
          else {
            if (!Object.values(option.choices).includes(value)) {
              return error(
                new BaseError({
                  message: `Invalid choice for ${name} option received`,
                  debugs: {
                    options: interaction.options.data,
                    definer: optionsList,
                    value,
                    valid: Object.values(option.choices),
                  },
                }),
              );
            }
          }
        }

        result[name] = value;
        break;
      }
    }
  }

  return ok(result as ContextOptions<T>);
}
