import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { nextI18NextConfig } from "./next-i18next.config";

i18n.use(initReactI18next).init({
  ...nextI18NextConfig.i18n,
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
