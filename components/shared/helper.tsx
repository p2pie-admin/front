import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";

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
export const enrichText = ({
  seen,
  text,
  articleCodes = [],
  pms = [],
}: {
  seen: Set<string>;
  text: string;
  articleCodes: string[];
  pms?: IPm[];
}): string => {
  if (!text || !articleCodes.length || !pms.length) return text;

  const lookup: { key: string; pm: IPm }[] = [];

  articleCodes.forEach((code) => {
    const pm = pms.find(
      (pm) =>
        pm.en_name.toLowerCase().replace(/\s+/g, "-") === code.toLowerCase()
    );
    if (!pm) return;

    const addVariant = (v?: string | null) => {
      if (!v) return;
      // normalize hyphens → spaces, lowercase
      const normalized = v.replace(/-/g, " ").trim();
      lookup.push({ key: normalized, pm });
    };

    addVariant(pm.currency.code);
    addVariant(capitalize(pm.en_name));
    addVariant(capitalize(pm.ru_name));
  });

  return text.replace(/\b[\p{L}\p{N}_-]+\b/gu, (word) => {
    const match = lookup.find(
      ({ key }) =>
        // Match exact word OR word starts with key (handles cases: банка, банку, банке)
        word.replace(/-/g, " ") === key.replace(/-/g, " ")
    );

    if (!match) return word;

    const slug =
      "/articles/" + match.pm.en_name.toLowerCase().replace(/\s+/g, "-");

    if (seen.has(slug)) return word;
    seen.add(slug);

    return `[**${word}**](${slug})`;
  });
};

export function secondsAgo(timestamp?: number | string): string {
  if (!timestamp) return "";
  const ts = typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const now = Date.now();
  const diffSec = Math.floor((now - ts) / 1000);

  if (diffSec < 0) return "в будущем";
  if (diffSec < 60) return `${diffSec}с`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}м`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}ч`;
  return `${Math.floor(diffSec / 86400)}д`;
}
