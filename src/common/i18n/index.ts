import { localeES } from "./locales/es";
import { localeEN } from "./locales/en";
import { ILocale } from "./ILocale";

export type SupportedLocale = "es" | "en";

class I18nManager {
  private currentLocale: SupportedLocale = this.getSystemLocale();
  private locales: Record<SupportedLocale, ILocale> = {
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

  private listeners = new Set<() => void>();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public setLocale(locale: SupportedLocale): void {
    if (locale in this.locales) {
      this.currentLocale = locale;
      this.listeners.forEach((trigger) => trigger());
    } else {
      console.warn(`Locale "${locale}" not supported. Using default.`);
    }
  }

  public getLocale(): SupportedLocale {
    return this.currentLocale;
  }
}

export const i18n = new I18nManager();
export type { ILocale } from "./ILocale";
