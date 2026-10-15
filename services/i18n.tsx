import { createContext, ReactNode, useContext } from "react";
import { useRouter } from "next/router";

// Two interface languages on the same URLs. The middleware picks one per visitor (cookie `lang`, then
// Accept-Language: any Russian-family language → ru, other languages → en, nothing → ru, so crawlers get ru)
// and rewrites English requests to the generated /xen/* copies of the pages. Pages get `locale` in props.
export type Locale = "ru" | "en";
export const EN_PREFIX = "/xen";
export const LANG_COOKIE = "lang";

const LocaleContext = createContext<Locale>("ru");

export const LocaleProvider = ({ locale, children }: { locale?: string | null; children: ReactNode }) => (
  <LocaleContext.Provider value={locale === "en" ? "en" : "ru"}>{children}</LocaleContext.Provider>
);

export const useLocale = () => useContext(LocaleContext);

// Inline pair translation: tr(locale, "Обменники", "Exchangers").
export const tr = (locale: Locale | string | null | undefined, ru: string, en: string) => (locale === "en" ? en : ru);

// In components: const t = useT(); t("Обменники", "Exchangers").
export const useT = () => {
  const locale = useLocale();
  return (ru: string, en: string) => tr(locale, ru, en);
};

// Locale inside getStaticProps: the English page copies pass locale "en".
export const localeOf = (ctx?: { locale?: string | null } | null): Locale => (ctx?.locale === "en" ? "en" : "ru");

// Name of a CMS entity with ru_/en_ fields in the current language, falling back to the other one.
export const pickName = <T extends Record<string, any>>(entity: T | null | undefined, locale: Locale, field = "name"): string => {
  if (!entity) return "";
  const ru = entity[`ru_${field}`];
  const en = entity[`en_${field}`];
  return (locale === "en" ? en || ru : ru || en) || "";
};

// router.pathname without the internal English prefix (English pages live under /xen).
export const publicPathname = (pathname: string) =>
  pathname === EN_PREFIX ? "/" : pathname.startsWith(`${EN_PREFIX}/`) ? pathname.slice(EN_PREFIX.length) : pathname;
export const usePublicPathname = () => publicPathname(useRouter().pathname);

// Number/date formatting locale.
export const intlLocale = (locale: Locale) => (locale === "en" ? "en-US" : "ru-RU");

export const setLangCookie = (locale: Locale) => {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
};
