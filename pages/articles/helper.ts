import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { IArticle, IChapter } from "../../types/pages";

export const textToHTML = (text: string): string => {
  // only for SSR
  const rawHTML = marked(text) as string; // Convert Markdown to HTML
  const sanitizedHTML = DOMPurify.sanitize(rawHTML); // Sanitize HTML
  return sanitizedHTML.replace(/\n/g, "<br>");
};

export function sanitizeArticle(article?: IArticle): IArticle | null {
  if (!article) return null;
  return {
    ...article,
    chapters: article.chapters.map((chapter) => sanitizeChapter(chapter)),
  };
}

export function sanitizeChapter(chapter: IChapter): IChapter {
  return {
    ...chapter,
    text: textToHTML(chapter.text), // Sanitize `text`
  };
}
