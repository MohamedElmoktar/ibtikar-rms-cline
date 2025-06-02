const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "fr",
    locales: ["ar", "fr", "en"],
    localeDetection: false,
  },
  fallbackLng: {
    default: ["fr"],
    ar: ["fr"],
    en: ["fr"],
  },
  debug: process.env.NODE_ENV === "development",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  localePath: path.resolve("./public/locales"),
  ns: [
    "common",
    "dashboard",
    "clients",
    "references",
    "technologies",
    "countries",
    "auth",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
