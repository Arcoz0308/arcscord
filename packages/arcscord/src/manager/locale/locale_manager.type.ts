import type { Locale, MaybePromise } from "#/utils";
import type { BaseInteraction, Guild, TextBasedChannel, User } from "discord.js";
import type i18next from "i18next";
import type { i18n, InitOptions } from "i18next";

/**
 * LangDetector is a type representing a function that detects the language for a given set of options.
 */
export type LangDetector = (options: {
  interaction: BaseInteraction | null;
  guild: Guild | null;
  user: User | null;
  channel: TextBasedChannel | null;
}) => MaybePromise<string | undefined>;

/**
 * Options to configure the LocaleManager.
 */
export type BaseLocaleManagerOptions = {
  /**
   * Enable or disable the locale manager
   *
   * @default false
   */
  enabled: true;

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

  /**
   * set a custom set of available language that are send to api if a localization property are set
   *
   * @default {@link LocaleManager.localeSet}
   */
  availableLanguages?: Locale[] | Set<Locale>;
};

type WithCustomI18n = BaseLocaleManagerOptions & {
  /**
   * Custom i18n instance
   *
   * Provide your own configured instance of i18n.
   */
  customI18n: i18n;
  i18nOptions?: never;
};

type WithI18nOptions = BaseLocaleManagerOptions & {
  /**
   * Configuration options for i18next
   *
   * Required options to customize the behavior of the
   * internationalization library. This may include settings such as
   * supported languages, fallback languages, detection options, and more.
   *
   * @see [i18next docs](https://www.i18next.com/overview/configuration-options)
   */
  i18nOptions: InitOptions;
  customI18n?: never;
};

export type LocaleManagerOptions = WithCustomI18n | WithI18nOptions | {
  /**
   * Enable or disable the locale manager
   *
   * @default false
   */
  enabled?: false;
};
export type LocaleCallback = (t: typeof i18next.t) => string;
