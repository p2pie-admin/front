import React from "react";
import { HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IArticle } from "../../../types/pages";
import { intlLocale, Locale, useLocale, useT } from "../../../services/i18n";

const formatDate = (ts?: string, locale: Locale = "ru") => {
  if (!ts) return "";
  const [y, m, d] = ts.split("T")[0].split("-");
  if (locale === "en") {
    const date = new Date(Date.UTC(+y, +m - 1, +d));
    if (!Number.isNaN(date.getTime()))
      return date.toLocaleDateString(intlLocale(locale), { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  }
  return `${d}.${m}.${y}`;
};

export default function ArticleStats({ article }: { article?: IArticle | null }) {
  const locale = useLocale();
  const t = useT();
  if (!article) return null;

  const textLength = article.text?.length || 0;
  const minToRead =
    article.time_to_read ?? (textLength ? Math.max(1, Math.round(textLength / 1000)) : 0);

  if (!article.updatedAt && !minToRead) return null;

  return (
    <HStack spacing="2">
      {article.updatedAt ? (
        <ResponsiveText size="sm" variant="primary">
          {formatDate(article.updatedAt, locale)}
        </ResponsiveText>
      ) : null}
      {article.updatedAt && minToRead ? (
        <ResponsiveText size="sm" variant="primary">
          •
        </ResponsiveText>
      ) : null}
      {minToRead ? (
        <ResponsiveText size="sm" variant="primary">
          {t(`${minToRead} мин чтения`, `${minToRead} min read`)}
        </ResponsiveText>
      ) : null}
    </HStack>
  );
}
