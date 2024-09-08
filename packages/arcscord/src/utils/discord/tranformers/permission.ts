import type { PermissionsString } from "discord.js";
import { PermissionsBitField } from "discord.js";
import type { Permissions } from "discord-api-types/v10";

export const permissionToAPI = (perm: PermissionsString | PermissionsString[]): Permissions => {
  const permResolvable = new PermissionsBitField();
  if (Array.isArray(perm)) {
    permResolvable.add(...perm);
  } else {
    permResolvable.add(perm);
  }


  return permResolvable.bitfield.toString(10);
};