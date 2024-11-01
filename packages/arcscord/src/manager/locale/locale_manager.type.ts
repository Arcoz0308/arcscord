import type { Locale } from "#/utils";
import type { BaseChannel, Guild, Interaction, User } from "discord.js";
import type { i18n, InitOptions } from "i18next";

/**
 * LangDetector is a type representing a function that detects the language for a given set of options.
 */
export type LangDetector = (options: {
  interaction: Interaction | null;
  guild: Guild | null;
  user: User | null;
  channel: BaseChannel | null;
}) => string | undefined;

/**
 * Options to configure the LocaleManager.
 */
export type LocaleManagerOptions = {
  /**
   * Configuration options for i18next
   *
   * `i18nOptions` can be passed to customize the behavior of the
   * internationalization library. This may include settings such as
   * supported languages, fallback languages, detection options, and more.
   *
   * @see [i18next docs](https://www.i18next.com/overview/configuration-options)
   * @default {@link LocaleManager.defaultI18Options}
   */
  i18nOptions?: InitOptions;

  /**
   * Custom i18n instance
   *
   * `customI18n` allows you to provide your own configured instance of i18n.
   * If set to false, a new instance will be initialized using `i18nOptions`.
   *
   * @default false
   */
  customI18n?: i18n | false;

  /**
   * Language map
   *
   * `languageMap` allows you to define custom mappings from language codes to the supported locales.
   * This can be particularly useful when dealing with regional dialects or specific language preferences.
   *
   * @default {@link LocaleManager.defaultLanguageMap}
   */
  languageMap?: Partial<Record<string, Locale | Locale[]>>;

  /**
   * Language detector
   *
   * `langDetector` is a function that determines the language based on interaction, guild, user, or channel context.
   * This function provides flexibility in customizing how the language is detected within different contexts.
   *
   * @default {@link LocaleManager.defaultLangDetector}
   */
  langDetector?: LangDetector;
};
