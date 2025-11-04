const path = require("path");
const siteLang =
  process.env.NEXT_PUBLIC_SITE_LANG?.toLowerCase() === "ru" ? "ru" : "en";

module.exports = {
  i18n: {
    defaultLocale: siteLang,
    locales: [siteLang], // only one locale per build
  },

  localePath: path.resolve("./public/locales"),
  ns: ["main"], // Your namespaces
  defaultNS: "main",
};
