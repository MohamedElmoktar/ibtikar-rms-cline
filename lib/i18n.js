import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all translation files
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

const resources = {
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

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "fr",
    fallbackLng: "fr",
    defaultNS: "common",
    ns: [
      "common",
      "dashboard",
      "clients",
      "references",
      "technologies",
      "countries",
      "auth",
    ],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
