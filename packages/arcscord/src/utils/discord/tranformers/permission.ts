import type { PermissionsString } from "discord.js";
import type { Permissions } from "discord-api-types/v10";
import { PermissionsBitField } from "discord.js";

export function permissionToAPI(
  perm: PermissionsString | PermissionsString[],
): Permissions {
  const permResolvable = new PermissionsBitField();
  if (Array.isArray(perm)) {
    permResolvable.add(...perm);
  }
  else {
    permResolvable.add(perm);
  }

  return permResolvable.bitfield.toString(10);
}
