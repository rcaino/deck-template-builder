import { useState, useCallback } from "react";
import { i18n, type SupportedLocale } from "../../../common/i18n";
import { LocaleKeys } from "../../../common/i18n/ILocale";
/**
 * Hook para usar i18n en componentes React
 * Permite cambiar el idioma y que los componentes se re-rendericen automáticamente
 */
export function useI18n(): {
  t: (key: LocaleKeys) => string;
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
} {
  const [locale, setLocaleState] = useState<SupportedLocale>(i18n.getLocale());

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    i18n.setLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return i18n.t(key);
    },
    [locale]
  );

  return {
    t,
    locale,
    setLocale,
    supportedLocales: i18n.getSupportedLocales()
  };
}
