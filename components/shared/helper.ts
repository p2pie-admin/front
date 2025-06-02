import { IArticle } from "../../types/pages";
import { IPm } from "../../types/selector";
import { marked, Renderer } from "marked";

export const textToHTML = async (
  text?: string,
  target: "blank" | "self" = "blank"
) => {
  if (!text?.trim()) return "";

  const renderer = new Renderer();
  renderer.link = ({ href, title, text }) => {
    if (!href || href.trim().toLowerCase().startsWith("javascript:"))
      return text;
    const titleAttr = title ? ` title="${title}"` : "";
    return `<a href="${href}" target="_${target}" rel="noopener noreferrer"${titleAttr}><b>${text}</b></a>`;
  };

  marked.setOptions({ breaks: true, gfm: true, renderer });
  return marked.parse(text);
};

export const enrichText = (
  text: string,
  articles: IArticle[] = [],
  pms: IPm[] = [],
  locale: "en" | "ru" = "en",
  pmToIgnore: IPm | null = null
) => {
  const articlePms = articles
    .map((a) =>
      pms.find((pm) => pm.en_name.toLowerCase() === a.code.toLowerCase())
    )
    .filter(
      (pm): pm is IPm =>
        !!pm && (!pmToIgnore || pm.en_name !== pmToIgnore.en_name)
    );

  const seen = new Set<string>();

  const replaced = text.replace(/\b\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    const pm = articlePms.find((pm) =>
      [pm.currency.code, pm.en_name.split(" ")[0], pm.ru_name]
        .filter(Boolean)
        .some((v) => v?.toLowerCase() === lower)
    );

    if (pm && !seen.has(lower)) {
      seen.add(lower);
      return `<a href="/${locale}/articles/${pm.en_name.toLowerCase()}"><b>${word}</b></a>`;
    }

    return word;
  });

  return textToHTML(replaced, "blank");
};
