import * as Localization from "expo-localization";
import { useCallback, useState } from "react";
import { i18n } from "../i18n";

type SupportedLocale = "en" | "fr";

export function useLocalization() {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    (i18n.locale.split("-")[0] as SupportedLocale) || "en"
  );

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  }, []);

  const t = useCallback((key: string, options?: any) => {
    return i18n.t(key, options);
  }, []);

  const getSystemLocale = useCallback(() => {
    return (
      (Localization.getLocales()[0]?.languageCode?.split(
        "-"
      )[0] as SupportedLocale) || "en"
    );
  }, []);

  return {
    locale,
    setLocale,
    t,
    getSystemLocale,
    supportedLocales: ["en", "fr"] as const,
  };
}
