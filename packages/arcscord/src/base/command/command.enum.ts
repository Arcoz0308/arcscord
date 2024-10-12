/**
 * Enum for command integration types.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/resources/application#application-object-application-integration-types)
 */
export const commandIntegrationTypesEnum = {
  /** For guild installations. */
  guildInstall: 0,
  /** For user installations. */
  userInstall: 1,
};

/**
 * Enum for command contexts.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types)
 */
export const commandContextsEnum = {
  /** Context of a guild. */
  guild: 0,
  /** Context of a bot direct message. */
  botDm: 1,
  /** Context of a private channel. */
  privateChannel: 2,
};

/**
 * Enum for command option types.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
 */
export const commandOptionTypesEnum = {
  /** String type. */
  string: 3,
  /** Integer type. */
  integer: 4,
  /** Boolean type. */
  boolean: 5,
  /** User type. */
  user: 6,
  /** Channel type. */
  channel: 7,
  /** Role type. */
  role: 8,
  /** Mentionable type. */
  mentionable: 9,
  /** Number type. */
  number: 10,
  /** Attachment type. */
  attachment: 11,
};
