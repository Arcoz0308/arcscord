import type { ArcClient } from "#/base";
import type { BaseMessageOptions } from "discord.js";

export function internalErrorEmbed(
  client: ArcClient,
  id?: string,
): BaseMessageOptions {
  return client.getErrorMessage(id);
}
