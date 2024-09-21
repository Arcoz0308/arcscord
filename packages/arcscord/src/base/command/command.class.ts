import type { APICommandObject, CommandRunResult } from "#/base/command/command.type";
import type { FullCommandDefinition } from "#/base/command/command_definition.type";
import type { ArcClient } from "#/base";
import type { BaseCommandOptions } from "#/base/command/base_command.class";
import { BaseCommand } from "#/base/command/base_command.class";
import { contextsToAPI, integrationTypeToAPI, optionListToAPI } from "#/utils/discord/tranformers/command";
import { ApplicationCommandType } from "discord-api-types/v10";
import { permissionToAPI } from "#/utils/discord/tranformers/permission";
import type { CommandContext } from "#/base/command/command_context";

export abstract class Command<T extends FullCommandDefinition = FullCommandDefinition> extends BaseCommand {

  definer: T;

  constructor(client: ArcClient, definer: T, options?: BaseCommandOptions) {
    super(client, options);

    this.definer = definer;
  }


  abstract run(ctx: CommandContext<T>): Promise<CommandRunResult>;

  toAPIObject(): APICommandObject {
    const obj: APICommandObject = {};

    if (this.definer.slash) {
      const def = this.definer.slash;

      obj.slash = {
        type: ApplicationCommandType.ChatInput,
        name: def.name,
        description: def.description,
        name_localizations: def.nameLocalizations,
        description_localizations: def.descriptionLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
        options: def.options ? optionListToAPI(def.options) : undefined,
      };
    }

    if (this.definer.user) {
      const def = this.definer.user;

      obj.user = {
        type: ApplicationCommandType.User,
        name: def.name,
        name_localizations: def.nameLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
      };
    }

    if (this.definer.message) {
      const def = this.definer.message;

      obj.message = {
        type: ApplicationCommandType.Message,
        name: def.name,
        name_localizations: def.nameLocalizations,
        default_member_permissions: def.defaultMemberPermissions
          ? permissionToAPI(def.defaultMemberPermissions) : undefined,
        nsfw: def.nsfw,
        contexts: def.contexts ? contextsToAPI(def.contexts) : undefined,
        integration_types: def.integrationTypes ? integrationTypeToAPI(def.integrationTypes) : undefined,
      };
    }

    return obj;
  }

}