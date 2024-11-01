import type { ArcClient } from "#/base";
import type { LangDetector, LocaleManagerOptions } from "#/manager/locale/locale_manager.type";
import type { Locale } from "#/utils";
import type { i18n, InitOptions } from "i18next";
import { BaseManager } from "#/base";
import i18next from "i18next";
import arcscordEn from "../../locales/en.json";
import arcscordFr from "../../locales/fr.json";

export class LocaleManager extends BaseManager {
  static defaultLanguageMap: Record<string, Locale | Locale[]> = {
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

  static defaultI18Options: InitOptions = {
    defaultNS: "empty",
    fallbackLng: "en",
    resources: {
      en: {
        arcscord: arcscordEn,
      },
      fr: {
        arcscord: arcscordFr,
      },
    },
  };

  static defaultLangDetector: LangDetector = (options) => {
    return options.interaction?.locale || options.guild?.preferredLocale;
  };

  static defaultOptions: Required<LocaleManagerOptions> = {
    customI18n: false,
    languageMap: LocaleManager.defaultLanguageMap,
    i18nOptions: LocaleManager.defaultI18Options,
    langDetector: LocaleManager.defaultLangDetector,
  };

  name = "locale";

  options: Required<LocaleManagerOptions>;

  i18n: i18n;

  t: typeof i18next.t;

  constructor(client: ArcClient, options: LocaleManagerOptions = LocaleManager.defaultOptions) {
    super(client);

    this.options = Object.assign(LocaleManager.defaultOptions, options);

    if (this.options.customI18n) {
      this.i18n = this.options.customI18n;
    }
    else {
      void i18next.init(this.options.i18nOptions);
      this.i18n = i18next;
    }
    this.t = this.i18n.t;

    if (!this.i18n.hasResourceBundle(this.defaultLanguage() || "en", "arcscord")) {
      this.i18n.addResourceBundle(this.defaultLanguage() || "en", "arcscord", arcscordEn, true);
    }
  }

  private defaultLanguage(): string | undefined {
    if (typeof this.i18n.options.fallbackLng === "string") {
      return this.i18n.options.fallbackLng;
    }
    return undefined;
  }
}
