import type { ArcClient } from "#/base";
import type { Locale } from "#/utils";
import type { BaseMessageOptions } from "discord.js";

export function internalErrorEmbed(
  client: ArcClient,
  id?: string,
  locale?: Locale,
): BaseMessageOptions {
  return client.getErrorMessage(id, locale);
}
