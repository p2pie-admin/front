// lib/getT.ts
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import mainRu from "../../public/locales/ru/main.json";
import mainEn from "../../public/locales/en/main.json";

const resources = {
  ru: { main: mainRu },
  en: { main: mainEn },
};

let initialized = false;

export async function getT(locale: string = "ru") {
  if (!initialized) {
    await i18next.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: "ru",
      ns: ["main"],
      defaultNS: "main",
      interpolation: { escapeValue: false },
    });
    initialized = true;
  }

  return i18next.getFixedT(locale, "main");
}
