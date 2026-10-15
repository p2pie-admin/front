import { Locale } from "../../services/i18n";

// Localized text of a P2P CMS entity (level, condition, ad, tag): the Russian value lives in the plain field
// (`title`, `description`, `details`, `name`), the English one in `en_<field>`. English falls back to Russian.
export const localized = (
  entity: object | null | undefined,
  field: string,
  locale: Locale,
): string => {
  if (!entity) return "";
  const record = entity as Record<string, unknown>;
  const ru = record[field];
  const en = record[`en_${field}`];
  const value = locale === "en" ? en || ru : ru;
  return typeof value === "string" ? value : value == null ? "" : String(value);
};
