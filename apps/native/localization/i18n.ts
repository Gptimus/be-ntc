import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { auth } from "./translations/auth";
import { common } from "./translations/common";

// Import translations by module

// Create i18n instance
export const i18n = new I18n({
  en: {
    auth: auth.en,
    common: common.en,
  },
  fr: {
    auth: auth.fr,
    common: common.fr,
  },
});

// Set locale
i18n.locale = Localization.getLocales()[0]?.languageCode || "fr";
i18n.enableFallback = true;
i18n.defaultLocale = "fr";
