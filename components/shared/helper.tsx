import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { IPm } from "../../types/selector";

/**
 * Markdown renderer with Next.js <Link> for internal navigation
 * and secure <a> for external links.
 */
export const TextToHTML = ({ text }: { text?: string }) => {
  if (!text?.trim()) return null;

  return (
    <ReactMarkdown
      components={{
        a: ({ href, children, ...props }) => {
          if (!href || href.trim().toLowerCase().startsWith("javascript:")) {
            return <>{children}</>;
          }

          const isInternal = href.startsWith("/");

          if (isInternal) {
            return (
              <Link href={href} {...props}>
                <b>{children}</b>
              </Link>
            );
          }

          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              <b>{children}</b>
            </a>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

/**
 * Enrich text with markdown links to article pages.
 */
export const enrichText = (
  text: string,
  articleCodes: string[] = [],
  pms: IPm[] = [],
  locale: "en" | "ru" = "en",
  pmToIgnore: IPm | null = null
): string => {
  const articlePms = articleCodes
    .map((code) => {
      if (typeof code !== "string") return null;

      return pms.find(
        (pm) =>
          pm.en_name.toLowerCase().replaceAll(" ", "_") === code.toLowerCase()
      );
    })
    .filter(
      (pm): pm is IPm =>
        !!pm && (!pmToIgnore || pm.en_name !== pmToIgnore.en_name)
    );

  const seen = new Set<string>();

  return text.replace(/\b\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    const pm = articlePms.find((pm) =>
      [pm.currency.code, pm.en_name.split(" ")[0], pm.ru_name]
        .filter(Boolean)
        .some((v) => v?.toLowerCase() === lower)
    );

    if (pm) {
      const slug = `/${locale}/articles/${pm.en_name.toLowerCase()}`;
      if (seen.has(slug)) return word;
      seen.add(slug);
      return `[**${word}**](${slug})`; // markdown bold link
    }

    return word;
  });
};
