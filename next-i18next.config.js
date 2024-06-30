const path = require("path");

module.exports = {
  i18n: {
    locales: ["en", "ru"], // Add your locales
    defaultLocale: "ru",
  },
  localePath: path.resolve("./public/locales"),
  ns: ["main"], // Your namespaces
  defaultNS: "main",
};
