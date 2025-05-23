const path = require("path");

module.exports = {
  i18n: {
    locales: ["en", "ru"], // Add your locales
    defaultLocale: "ru", // Set default locale to 'ru'
    localeDetection: false, // Disable automatic locale detection
  },
  localePath: path.resolve("./public/locales"),
  ns: ["main"], // Your namespaces
  defaultNS: "main",
};
