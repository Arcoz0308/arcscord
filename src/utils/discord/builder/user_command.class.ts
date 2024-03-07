import { ContextMenuCommandBuilder } from "discord.js";
import type { StringPermissions } from "#/utils/discord/utils/util.type";
import { PermissionFlagsBits } from "discord-api-types/v10";

export class UserCommandBuilder extends ContextMenuCommandBuilder {

  type = 2;


  /**
   * @deprecated dont use !
   */
  setType(): this {
    return this;
  }

  setDefaultMemberPermissions(permissions: StringPermissions | bigint | number | null | undefined): this {
    if (typeof permissions === "string") {
      permissions = PermissionFlagsBits[permissions];
    }
    return super.setDefaultMemberPermissions(permissions);
  }

}