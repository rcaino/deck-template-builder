import { useCallback, useSyncExternalStore } from "react";
import { i18n, type SupportedLocale } from "../../../common/i18n";
import { LocaleKeys } from "../../../common/i18n/ILocale";

export function useI18n(): {
  t: (key: LocaleKeys) => string;
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
} {
  const locale = useSyncExternalStore(
    (callback) => i18n.subscribe(callback),
    () => i18n.getLocale()
  );

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    i18n.setLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: LocaleKeys): string => {
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
