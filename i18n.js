import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const siteLang =
  process.env.NEXT_PUBLIC_SITE_LANG?.toLowerCase() === "ru" ? "ru" : "en";

i18n.use(initReactI18next).init({
  lng: siteLang,
  fallbackLng: siteLang,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
