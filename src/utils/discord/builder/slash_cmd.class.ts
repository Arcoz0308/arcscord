import { SlashCommandBuilder } from "discord.js";
import type { StringPermissions } from "#/utils/discord/utils/util.type";
import { PermissionFlagsBits } from "discord-api-types/v10";

export class SlashCmdBuilder extends SlashCommandBuilder {

  setDefaultMemberPermissions(permissions: StringPermissions | bigint | number | null | undefined): this {
    if (typeof permissions === "string") {
      permissions = PermissionFlagsBits[permissions];
    }
    return super.setDefaultMemberPermissions(permissions);
  }

}