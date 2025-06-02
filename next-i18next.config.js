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
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  localePath: "./public/locales",
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
  serializeConfig: false,
  use: [],
};
