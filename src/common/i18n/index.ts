import { localeES } from "./locales/es";
import { localeEN } from "./locales/en";
import { ILocale } from "./ILocale";

export type SupportedLocale = "es" | "en";

class I18nManager {
  public currentLocale: SupportedLocale = this.getSystemLocale();
  public locales: Record<SupportedLocale, ILocale> = {
    es: localeES,
    en: localeEN
  };

  public getSystemLocale(): SupportedLocale {
    const systemLang = navigator.language.split("-")[0];
    if (systemLang === "en" || systemLang === "es") {
      return systemLang;
    }
    return "en"; // fallback
  }

  public setLocale(locale: SupportedLocale): void {
    if (locale in this.locales) {
      this.currentLocale = locale;
    } else {
      console.warn(`Locale "${locale}" not supported. Using default.`);
    }
  }

  public getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  public t(key: string): string {
    const keys = key.split(".");
    let value: ILocale = this.locales[this.currentLocale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  public getSupportedLocales(): SupportedLocale[] {
    return Object.keys(this.locales) as SupportedLocale[];
  }
}

export const i18n = new I18nManager();
