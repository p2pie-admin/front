import { IArticle } from "../../types/pages";
import { marked, Renderer, RendererObject } from "marked";

function addLinksToText(
  text: string,
  articleCodesSet: Set<string>,
  seenCodes: Set<string>
): string {
  return text.replace(/\n/g, "<br>").replace(/\b\w+\b/g, (word) => {
    const lowerWord = word.toLowerCase();
    if (articleCodesSet.has(lowerWord) && !seenCodes.has(lowerWord)) {
      seenCodes.add(lowerWord);
      return `<a href="/en/articles/${lowerWord}">${word}</a>`;
    }
    return word;
  });
}

export const addCrossLinking = (articles: IArticle[]): IArticle[] => {
  const articleCodesSet = new Set(articles.map((a) => a.code.toLowerCase()));

  return articles.map((article) => {
    const seenCodes = new Set<string>(); // Moved here to track per article

    article.chapters = article.chapters.map((chapter) => {
      const textWithLinks = addLinksToText(
        chapter.text,
        articleCodesSet,
        seenCodes
      );

      return {
        ...chapter,
        text: textWithLinks,
      };
    });

    return article;
  });
};

export const textToHTML = async (text: string, target: "blank" | "self") => {
  const renderer = new Renderer();

  renderer.link = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : "";
    // Optionally prevent unsafe links
    if (!href || href.trim().toLowerCase().startsWith("javascript:"))
      return text;
    return `<a href="${href}" target="_${target}" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer,
  });

  return await marked.parse(text);
};

export async function convertArticle(
  article?: IArticle
): Promise<IArticle | null> {
  if (!article) return null;
  return {
    ...article,
    chapters: await Promise.all(
      article.chapters.map((chapter) => convertChapter(chapter))
    ),
  };
}

export async function convertChapter(chapter: { title: string; text: string }) {
  return {
    ...chapter,
    text: await textToHTML(chapter.text, "blank"),
  };
}
