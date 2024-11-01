import type { Locale } from "#/utils";
import type { BaseChannel, Guild, Interaction, User } from "discord.js";
import type { i18n, InitOptions } from "i18next";

export type LangDetector = (options: {
  interaction: Interaction | null;
  guild: Guild | null;
  user: User | null;
  channel: BaseChannel | null;
}) => string | undefined;

export type LocaleManagerOptions = {
  i18nOptions?: InitOptions;
  customI18n?: i18n | false;
  languageMap?: Partial<Record<string, Locale | Locale[]>>;
  langDetector?: LangDetector;
};
