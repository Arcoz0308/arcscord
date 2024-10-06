import type { ArcClient } from "#/base";

export const internalErrorEmbed = (client: ArcClient, id?: string) => client.defaultMessages.error(id);