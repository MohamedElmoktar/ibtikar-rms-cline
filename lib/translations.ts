// Import all translation files directly
import commonEn from "../public/locales/en/common.json";
import commonFr from "../public/locales/fr/common.json";
import commonAr from "../public/locales/ar/common.json";

import dashboardEn from "../public/locales/en/dashboard.json";
import dashboardFr from "../public/locales/fr/dashboard.json";
import dashboardAr from "../public/locales/ar/dashboard.json";

import clientsEn from "../public/locales/en/clients.json";
import clientsFr from "../public/locales/fr/clients.json";
import clientsAr from "../public/locales/ar/clients.json";

import referencesEn from "../public/locales/en/references.json";
import referencesFr from "../public/locales/fr/references.json";
import referencesAr from "../public/locales/ar/references.json";

import technologiesEn from "../public/locales/en/technologies.json";
import technologiesFr from "../public/locales/fr/technologies.json";
import technologiesAr from "../public/locales/ar/technologies.json";

import countriesEn from "../public/locales/en/countries.json";
import countriesFr from "../public/locales/fr/countries.json";
import countriesAr from "../public/locales/ar/countries.json";

import authEn from "../public/locales/en/auth.json";
import authFr from "../public/locales/fr/auth.json";
import authAr from "../public/locales/ar/auth.json";

export const translations = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    clients: clientsEn,
    references: referencesEn,
    technologies: technologiesEn,
    countries: countriesEn,
    auth: authEn,
  },
  fr: {
    common: commonFr,
    dashboard: dashboardFr,
    clients: clientsFr,
    references: referencesFr,
    technologies: technologiesFr,
    countries: countriesFr,
    auth: authFr,
  },
  ar: {
    common: commonAr,
    dashboard: dashboardAr,
    clients: clientsAr,
    references: referencesAr,
    technologies: technologiesAr,
    countries: countriesAr,
    auth: authAr,
  },
};

export type Locale = keyof typeof translations;
export type Namespace = keyof typeof translations.en;

// Simple translation function
export function translate(
  locale: Locale,
  namespace: Namespace,
  key: string
): string {
  const keys = key.split(".");
  let value: any = translations[locale]?.[namespace];

  for (const k of keys) {
    if (value && typeof value === "object") {
      value = value[k];
    } else {
      break;
    }
  }

  // Fallback to French if translation not found
  if (typeof value !== "string" && locale !== "fr") {
    return translate("fr", namespace, key);
  }

  // Return key if no translation found
  return typeof value === "string" ? value : key;
}
