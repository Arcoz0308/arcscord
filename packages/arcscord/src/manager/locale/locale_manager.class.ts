import type { ArcClient } from "#/base";
import type { BaseLocaleManagerOptions, LangDetector, LocaleManagerOptions } from "#/manager/locale/locale_manager.type";
import type { Locale } from "#/utils";
import type { i18n } from "i18next";
import { BaseManager } from "#/base";
import { anyToError } from "@arcscord/error";
import i18next from "i18next";

/**
 * Manages localization for the application.
 *
 * The LocaleManager handles language detection, initialization of the i18next library,
 * and management of language resources and mappings.
 */
export class LocaleManager extends BaseManager {
  /**
   * A set containing Locale keys
   */
  static readonly localeSet: Set<Locale> = new Set([
    "id",
    "da",
    "de",
    "en-GB",
    "en-US",
    "es-ES",
    "es-419",
    "fr",
    "hr",
    "it",
    "lt",
    "hu",
    "nl",
    "no",
    "pl",
    "pt-BR",
    "ro",
    "fi",
    "sv-SE",
    "vi",
    "tr",
    "cs",
    "el",
    "bg",
    "ru",
    "uk",
    "hi",
    "th",
    "zh-CN",
    "ja",
    "zh-TW",
    "ko",
  ]);

  /**
   * Default language map defining the supported locales.
   * Maps language codes to either a single locale or an array of locales.
   */
  static readonly defaultLanguageMap: Record<string, Locale | Locale[]> = {
    id: "id",
    da: "da",
    de: "de",
    en: ["en-GB", "en-US"],
    es: ["es-ES", "es-419"],
    fr: "fr",
    hr: "hr",
    it: "it",
    lt: "lt",
    hu: "hu",
    nl: "nl",
    no: "no",
    pl: "pl",
    pt: "pt-BR",
    ro: "ro",
    fi: "fi",
    sv: "sv-SE",
    vi: "vi",
    tr: "tr",
    cs: "cs",
    el: "el",
    bg: "bg",
    ru: "ru",
    uk: "uk",
    hi: "hi",
    th: "th",
    zh: ["zh-CN", "zh-TW"],
    ja: "ja",
    ko: "ko",
  };

  /**
   * Default language detection function.
   * Determines the language based on interaction or guild context.
   */
  static defaultLangDetector: LangDetector = (options) => {
    return options.interaction?.locale || options.guild?.preferredLocale;
  };

  /**
   * Default options for the LocaleManager.
   * Combines custom i18n instance settings, language map, i18n initialization options,
   * and language detection function.
   */
  static defaultOptions: Partial<BaseLocaleManagerOptions> = {
    languageMap: LocaleManager.defaultLanguageMap,
    langDetector: LocaleManager.defaultLangDetector,
    availableLanguages: LocaleManager.localeSet,
  };

  /**
   * represent the latest i18next instance created
   */
  static i18n = i18next;

  /**
   * The name of the manager.
   */
  readonly name = "locale";

  /**
   * Enable or disable the locale manager
   */
  readonly enabled: boolean;

  /**
   * The options used by the LocaleManager.
   */
  readonly options: LocaleManagerOptions;

  /**
   * The i18n instance used for localization.
   */
  i18n: i18n;

  /**
   * The translation function provided by i18next.
   * alias of LocaleManager.i18n.t
   */
  t: typeof i18next.t;

  /**
   * An instance of the LangDetector class responsible for language detection.
   */
  readonly detect: LangDetector;

  readonly availableLanguages: Set<Locale>;

  /**
   * Constructs a new instance of the LocaleManager.
   *
   * @param client - The ArcClient instance.
   * @param options - Options to configure the LocaleManager.
   */
  constructor(client: ArcClient, options: LocaleManagerOptions = { enabled: false }) {
    super(client);

    this.options = options;
    this.enabled = options.enabled ?? false;
    this.i18n = i18next;

    if (!options.enabled) {
      this.i18n = i18next;
      this.t = this.i18n.t;
      this.detect = LocaleManager.defaultLangDetector;
      this.availableLanguages = LocaleManager.localeSet;
      return;
    }
    else if ("customI18n" in options && options.customI18n) {
      this.i18n = options.customI18n;
    }
    else {
      void i18next.init(options.i18nOptions);
      this.i18n = i18next;
    }
    this.t = this.i18n.t;
    LocaleManager.i18n = this.i18n;

    this.detect = options.langDetector ?? LocaleManager.defaultLangDetector;
    this.availableLanguages = options.availableLanguages instanceof Set
      ? options.availableLanguages
      : new Set(options.availableLanguages ?? LocaleManager.localeSet);
  }

  /**
   * @internal
   */
  private defaultLanguage(): string {
    if (typeof this.i18n.options.fallbackLng === "string") {
      return this.i18n.options.fallbackLng;
    }
    if (Array.isArray(this.i18n.options.fallbackLng)) {
      return this.i18n.options.fallbackLng[0] || "en";
    }
    return "en";
  }

  /**
   * Maps the detected language to a key based on the defined languageMap.
   *
   * For example for transform a discord lang key to a locale lang key
   *
   * @param lang - The detected language.
   * @returns The mapped language key.
   */
  mapLanguage(lang: string): string {
    if (!this.options.enabled) {
      return lang;
    }

    for (const [key, value] of Object.entries({ ...this.options.languageMap })) {
      if (Array.isArray(value)) {
        if (value.includes(lang as Locale)) {
          return key;
        }
      }
      else {
        if (value === lang) {
          return key;
        }
      }
    }
    return lang;
  }

  /**
   * Detects the language based on the provided options.
   *
   * @param options - The options for language detection.
   * @returns The detected language key.
   */
  async detectLanguage(options: Parameters<LangDetector>[0]): Promise<string> {
    try {
      const lang = await this.detect(options);
      return this.mapLanguage(lang || this.defaultLanguage());
    }
    catch (e) {
      this.logger.warning(`Failed to detect language, a throw happens, error : ${anyToError(e).message}`);
      return this.defaultLanguage();
    }
  }
}
